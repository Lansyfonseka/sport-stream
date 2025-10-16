import { useState, useEffect } from "react";
import { AppConfig } from "../config/app.config";
import { fetchScheduleFromFrontend } from "../services/scheduleService";

export function useIPTVData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          channelsRes,
          streamsRes,
          categoriesRes,
          blocklistRes,
          logosRes,
          scheduleRes,
        ] = await Promise.all([
          fetch("https://iptv-org.github.io/api/channels.json"),
          fetch("https://iptv-org.github.io/api/streams.json"),
          fetch("https://iptv-org.github.io/api/categories.json"),
          fetch("https://iptv-org.github.io/api/blocklist.json"),
          fetch("https://iptv-org.github.io/api/logos.json"),
          // Получаем расписание с бэкенда только если флаг выключен
          AppConfig.useFrontendSchedule 
            ? Promise.resolve(null)
            : fetch(`${AppConfig.baseBackUrl}/api/schedule`).catch(() => null),
        ]);

        const [channels, streams, categories, blocklist, logos] =
          await Promise.all([
            channelsRes.json(),
            streamsRes.json(),
            categoriesRes.json(),
            blocklistRes.json(),
            logosRes.json(),
          ]);

        // Получаем расписание
        let scheduleMatches = [];
        
        if (AppConfig.useFrontendSchedule) {
          // Получаем расписание с фронтенда
          console.log('Fetching schedule from frontend...');
          scheduleMatches = await fetchScheduleFromFrontend();
        } else {
          // Получаем расписание с бэкенда
          const scheduleData =
            scheduleRes && scheduleRes.ok
              ? await scheduleRes.json()
              : { matches: [] };
          scheduleMatches = scheduleData.matches || [];
        }

        console.log(
          `Загружено запланированных матчей: ${scheduleMatches.length}`
        );

        // Создаем мапу логотипов каналов по channel ID
        const logoMap = new Map();
        logos.forEach((logo) => {
          if (logo.url && logo.channel) {
            if (!logoMap.has(logo.channel)) {
              logoMap.set(logo.channel, logo.url);
            }
          }
        });

        // Создаем Set заблокированных каналов для быстрой проверки
        const blockedChannels = new Set(blocklist.map((b) => b.channel));

        // Фильтруем только спортивные каналы (исключая заблокированные)
        const sportChannelIds = channels
          .filter(
            (ch) =>
              ch.categories?.includes("sports") && !blockedChannels.has(ch.id)
          )
          .map((ch) => ch.id);

        // Фильтруем стримы: только HTTP/HTTPS, без UDP
        const sportStreams = streams.filter(
          (stream) =>
            sportChannelIds.includes(stream.channel) &&
            stream.url &&
            (stream.url.startsWith("http://") ||
              stream.url.startsWith("https://")) &&
            !stream.url.includes("/udp/")
        );

        console.log(
          `Всего спортивных стримов: ${
            streams.filter((s) => sportChannelIds.includes(s.channel)).length
          }`
        );
        console.log(
          `После фильтрации (только HTTP/HTTPS, без UDP): ${sportStreams.length}`
        );

        // Создаем мапу каналов для быстрого доступа
        const channelsMap = new Map(channels.map((ch) => [ch.id, ch]));

        // Функция определения категории по названию
        const detectCategory = (title) => {
          const lower = title.toLowerCase();
          if (
            lower.includes("football") ||
            lower.includes("soccer") ||
            lower.includes("fifa")
          )
            return "cat-football";
          if (lower.includes("basketball") || lower.includes("nba"))
            return "cat-basketball";
          if (lower.includes("tennis")) return "cat-tennis";
          if (lower.includes("volleyball")) return "cat-volleyball";
          if (lower.includes("hockey") || lower.includes("nhl"))
            return "cat-icehockey";
          if (lower.includes("baseball") || lower.includes("mlb"))
            return "cat-baseball";
          if (lower.includes("cricket")) return "cat-cricket";
          if (lower.includes("rugby")) return "cat-rugby";
          if (
            lower.includes("boxing") ||
            lower.includes("mma") ||
            lower.includes("ufc")
          )
            return "cat-fighting";
          if (
            lower.includes("racing") ||
            lower.includes("f1") ||
            lower.includes("formula")
          )
            return "cat-racing";
          if (lower.includes("table tennis") || lower.includes("ping pong"))
            return "cat-tabletennis";
          if (lower.includes("handball")) return "cat-handball";
          if (lower.includes("esport") || lower.includes("gaming"))
            return "cat-esports";
          return "cat-other";
        };

        // Преобразуем в формат для SportsBrowser
        const matches = sportStreams.map((stream, index) => {
          const channel = channelsMap.get(stream.channel);
          const title = stream.title || channel?.name || "Unknown";
          const categoryId = detectCategory(title);

          const channelLogo = logoMap.get(stream.channel) || null;

          return {
            id: `${stream.channel}-${
              stream.feed || "default"
            }-${stream.url.substring(stream.url.length - 10)}-${index}`,
            sport: categoryId.replace("cat-", ""),
            league: channel?.name || stream.title,
            country: channel?.country || "Unknown",
            status: "live",
            format: stream.quality || null,
            kickoff_local: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            channel_logo: channelLogo,
            home: {
              name: title,
              logo_url: null,
            },
            away: {
              name: "",
              logo_url: null,
            },
            category_id: categoryId,
            stream_url: stream.url,
            referrer: stream.referrer,
            user_agent: stream.user_agent,
          };
        });

        // Добавляем запланированные матчи
        const scheduledMatches = scheduleMatches;
        const allMatches = [...matches, ...scheduledMatches];

        console.log(
          `Всего матчей: ${allMatches.length} (live: ${matches.length}, scheduled: ${scheduledMatches.length})`
        );

        // Собираем уникальные категории из всех матчей
        const categoriesSet = new Set(allMatches.map((m) => m.category_id));

        // Определяем все возможные категории с правильными slug для иконок
        const allCategories = [
          { id: "cat-football", name: "Football", slug: "football" },
          { id: "cat-basketball", name: "Basketball", slug: "basketball" },
          { id: "cat-tennis", name: "Tennis", slug: "tennis" },
          { id: "cat-volleyball", name: "Volleyball", slug: "volleyball" },
          { id: "cat-icehockey", name: "Ice Hockey", slug: "ice-hockey" },
          { id: "cat-baseball", name: "Baseball", slug: "baseball" },
          { id: "cat-cricket", name: "Cricket", slug: "cricket" },
          { id: "cat-rugby", name: "Rugby", slug: "rugby" },
          { id: "cat-fighting", name: "Fighting", slug: "boxing" },
          { id: "cat-racing", name: "Racing", slug: "racing" },
          { id: "cat-tabletennis", name: "Table Tennis", slug: "table-tennis" },
          { id: "cat-handball", name: "Handball", slug: "handball" },
          { id: "cat-esports", name: "Esports", slug: "esports" },
          { id: "cat-other", name: "Other Sports", slug: "football" },
        ];

        // Фильтруем только те категории, которые есть в данных
        const sportCategories = allCategories.filter((cat) =>
          categoriesSet.has(cat.id)
        );

        const transformedData = {
          categories: sportCategories,
          matches: allMatches,
          scheduledMatches: scheduledMatches, // Отдельно для слайдера
        };

        setData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching IPTV data:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
