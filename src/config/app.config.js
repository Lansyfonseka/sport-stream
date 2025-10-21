const baseFrontUrlDev = 'http://localhost:5173'
const baseBackUrlDev = 'http://localhost:3005'

const baseFrontUrlProd = 'https://princebet.tv'
const baseBackUrlProd = 'http://princebet.tv:3005'

const USE_PRODUCTION = true

// получать расписание с фронтенда (true) или с бэкенда (false)
const USE_FRONTEND_SCHEDULE = true

export const AppConfig = {
  baseFrontUrl: USE_PRODUCTION ? baseFrontUrlProd : baseFrontUrlDev,
  baseBackUrl: USE_PRODUCTION ? baseBackUrlProd : baseBackUrlDev,
  useFrontendSchedule: USE_FRONTEND_SCHEDULE,
}
