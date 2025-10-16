const API_KEY = '3';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

// Кэширование для избежания 429 ошибок от TheSportsDB API
// - Кэш на 1 день для каждой лиги
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const CACHE_PREFIX = 'schedule_cache_';

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        console.log(`Using cached data for ${key}`);
        return parsed.data;
      } else {
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

const setCachedData = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

export const clearScheduleCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Schedule cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

const LEAGUES = {
  football: [
    { id: '4328', name: 'English Premier League' },
    { id: '4335', name: 'Spanish La Liga' },
    { id: '4331', name: 'German Bundesliga' },
    { id: '4424', name: 'UEFA Champions League' },
  ],
};

const mapSportName = (sport) => {
  const mapping = {
    football: 'football',
    basketball: 'basketball',
    icehockey: 'icehockey',
    tennis: 'tennis',
  };
  return mapping[sport] || sport;
};

const fetchLeagueSchedule = async (leagueId, sport, leagueName, today) => {
  try {
    // Ключ без даты - актуальность проверяется по timestamp
    const cacheKey = `league-${leagueId}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const url = `${BASE_URL}/${API_KEY}/eventsnextleague.php?id=${leagueId}`;
    console.log(`Fetching ${leagueName}:`, url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const events = data?.events || [];
    console.log(`${leagueName}: received ${events.length} events`);
    
    // Фильтруем матчи на ближайшие 7 дней
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    const weekLaterStr = weekLater.toISOString().split('T')[0];

    const filtered = events.filter(event => {
      const eventDate = event.dateEvent;
      return eventDate >= today && eventDate <= weekLaterStr;
    });
    
    console.log(`${leagueName}: ${filtered.length} matches for next 7 days`);

    const result = filtered.map((event) => ({
      id: event.idEvent,
      sport: mapSportName(sport),
      league: leagueName,
      home: {
        name: event.strHomeTeam || 'TBD',
        logo_url: event.strHomeTeamBadge || null,
      },
      away: {
        name: event.strAwayTeam || 'TBD',
        logo_url: event.strAwayTeamBadge || null,
      },
      kickoff_local: event.strTime || event.strTimeLocal || '00:00:00',
      date: event.dateEvent,
      status: 'scheduled',
      category_id: `cat-${sport}`,
    }));
    
    setCachedData(cacheKey, result);
    console.log(`${leagueName}: saved to localStorage cache`);
    return result;
  } catch (error) {
    console.error(`Error fetching ${leagueName}:`, error.message);
    return [];
  }
};

export const fetchScheduleFromFrontend = async () => {
  const today = new Date().toISOString().split('T')[0];
  console.log('Fetching schedule from frontend for', today);
  
  const allMatches = [];
  const promises = [];

  for (const [sport, leagues] of Object.entries(LEAGUES)) {
    for (const league of leagues) {
      promises.push(
        fetchLeagueSchedule(league.id, sport, league.name, today)
      );
    }
  }

  const results = await Promise.all(promises);
  results.forEach(matches => allMatches.push(...matches));

  // Удаляем дубликаты по ID матча
  const uniqueMatches = [];
  const seenIds = new Set();
  
  for (const match of allMatches) {
    if (!seenIds.has(match.id)) {
      seenIds.add(match.id);
      uniqueMatches.push(match);
    }
  }

  // Сортируем по времени
  uniqueMatches.sort((a, b) => a.kickoff_local.localeCompare(b.kickoff_local));

  console.log(`Fetched ${allMatches.length} matches, ${uniqueMatches.length} unique`);
  return uniqueMatches;
};
