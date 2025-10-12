import './_sportsBrowser.scss';

import { useMemo, useState } from "react";
import { getCategoryIcon } from './icons-map';


/**
 * Props:
 *  - data: {
 *      categories: { id: string, name: string, slug: string }[],
 *      matches: {
 *        id: string, sport: string, league: string, country: string,
 *        status: "scheduled"|"live"|"finished"|"postponed",
 *        format?: string|null, kickoff_local: string,
 *        home: { name: string, logo_url?: string|null },
 *        away: { name: string, logo_url?: string|null },
 *        category_id: string
 *      }[]
 *    }
 *  - className?: string
 */


export default function SportsBrowser({ data, className = "" }) {
  const [activeCat, setActiveCat] = useState(
    data?.categories?.[0]?.id ?? null
  );
  const [query, setQuery] = useState("");

  if (!data || !data.categories || !data.matches) {
    return <div className="sb sb--empty">Нет данных</div>;
  }

  // нормализация строки для поиска
  const norm = (s = "") =>
    s.toString().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

  const statsByCat = useMemo(() => {
    const map = new Map();
    map.set('all', data.matches.length)
    for (const c of data.categories) map.set(c.id, 0);
    for (const m of data.matches) {
      map.set(m.category_id, (map.get(m.category_id) ?? 0) + 1);
    }
    return map;
  }, [data]);

  const filtered = useMemo(() => {
    const q = norm(query);
    const filterCategory = data.matches.filter((m) => (activeCat ? m.category_id === activeCat || activeCat === 'all' : true))
    const filterQuery = filterCategory.filter((m) => {
        if (!q) return true;
        const hay =
          norm(m.league) +
          " " +
          norm(m.home?.name) +
          " " +
          norm(m.away?.name) +
          " " +
          norm(m.country) +
          " " +
          norm(m.format ?? "");
        return hay.includes(q);
      })
    return filterQuery.sort((a, b) => (a.kickoff_local || "").localeCompare(b.kickoff_local));
  }, [data, activeCat, query]);

  return (
    <div className={`sb ${className}`}>
      <label className="sb__search" aria-label="Game search">
          <svg viewBox="0 0 24 24" aria-hidden className="sb__search-ic">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zM4 9.5C4 6.46 6.46 4 9.5 4S15 6.46 15 9.5 12.54 15 9.5 15 4 12.54 4 9.5Z" />
          </svg>
          <input
            type="search"
            placeholder="Search: team, leage, country…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      {/* Header */}
      <div className="sb__bar">
        <div className="sb__tabs" role="tablist" aria-label="Sport category">
          <button
              key={'all'}
              role="tab"
              aria-selected={activeCat === 'all'}
              className={`sb__tab ${activeCat === 'all' ? "is-active" : ""}`}
              onClick={() => setActiveCat('all')}
              title={'All'}
            >
              <span className="sb__tab-count">{statsByCat.get('all') ?? 0}</span>
              <span className="sb__tab-name">All</span>
            </button>
          {data.categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={activeCat === c.id}
              className={`sb__tab ${activeCat === c.id ? "is-active" : ""}`}
              onClick={() => setActiveCat(c.id)}
              title={c.name}
            >
              <span className="sb__tab-count">{statsByCat.get(c.id) ?? 0}</span>
              <span className="sb__tab-name">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <use href={`/icons.svg#sports_${getCategoryIcon(c.slug)}`}></use>
                </svg>
              </span>
            </button>
          ))}
        </div>

        
      </div>

      {/* Grid */}
      <ul className="sb__grid" aria-live="polite">
        {filtered.map((m) => (
          <li key={m.id} className={`sb-card sb-card--${m.status}`}>
            {/* <img src={m.home?.logo_url} alt="home-logo" className="sb-team__logo" loading="lazy" /> */}
            <img src={'https://stream.prod.wisegaming.com/logos/2f7a593b6d791b0183e30a891676bd44.png'} alt="home-logo" className="sb-team__logo" loading="lazy" />
            <div className='sb-card__match-detail'>
              <span className='sb-card__match-detail_category'>{m.sport}</span>
              <span className='sb-card__match-detail_time-league'>{m.kickoff_local} | {m.league}</span>
              <span className='sb-card__match-detail_team'>
                <span>{m.home.name}</span>
                <span>{m.away.name}</span>
              </span>
            </div>
            {/* <img src={m.away?.logo_url} alt="away-logo" className="sb-team__logo" loading="lazy" /> */}
            <img src={'https://stream.prod.wisegaming.com/logos/4adac0619ab89c05eaf9e946b9d6ac14.png'} alt="away-logo" className="sb-team__logo" loading="lazy" />            
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="sb__empty">Ничего не найдено. Попробуйте изменить запрос.</div>
      )}
    </div>
  );
}

function Team({ name, logo, align = "left" }) {
  return (
    <div className={`sb-team sb-team--${align}`}>
      {logo ? (
        <img src={logo} alt="" className="sb-team__logo" loading="lazy" />
      ) : (
        <div className="sb-team__logo sb-team__logo--placeholder" aria-hidden />
      )}
      <span className="sb-team__name">{name}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const label =
    status === "live"
      ? "LIVE"
      : status === "finished"
      ? "FT"
      : status === "postponed"
      ? "PPD"
      : "SCH";
  return <span className={`sb-status sb-status--${status}`}>{label}</span>;
}
