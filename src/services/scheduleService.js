const API_KEY = '3';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

const LEAGUES = {
  football: [
    { id: '4328', name: 'English Premier League' },
    { id: '4335', name: 'Spanish La Liga' },
    { id: '4331', name: 'German Bundesliga' },
    { id: '4424', name: 'UEFA Champions League' },
  ],
  basketball: [
    { id: '4387', name: 'NBA' },
  ],
  icehockey: [
    { id: '4380', name: 'NHL' },
  ],
  tennis: [
    { id: '4421', name: 'ATP Tour' },
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

    return filtered.map((event) => ({
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
