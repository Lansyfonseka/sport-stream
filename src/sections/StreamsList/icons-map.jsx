/* хелпер для сопоставления с категориями */
export const getCategoryIcon = (slug) => {
  const map = {
    football: 1,
    soccer: 1,
    "ice-hockey": 2,
    esports: 40,
    basketball: 3,
    baseball: 5,
    tennis: 4,
    volleyball: 6,
    rugby: 7,
    waterpolo: "waterpolo",
    americanFootball: 13,
    hockey: 2,
    fifa: 85,
    futsal: 14,
    handball: 8,
    cricket: 66,
    mma: 103,
    boxing: 9,
    efootball: 144,
    bitchVolleyball: 29,
    "table-tennis": 10,
    racing: 11,
    other: 1,
  };
  return map[slug] || 1;
};
