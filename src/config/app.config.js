const baseFrontUrlDev = 'http://localhost:5173'
const baseBackUrlDev = 'http://localhost:3005'

const baseFrontUrlProd = 'http://212.80.205.187'
const baseBackUrlProd = 'http://212.80.205.187:3005'

const USE_PRODUCTION = true

// получать расписание с фронтенда (true) или с бэкенда (false)
const USE_FRONTEND_SCHEDULE = true

export const AppConfig = {
  baseFrontUrl: USE_PRODUCTION ? baseFrontUrlProd : baseFrontUrlDev,
  baseBackUrl: USE_PRODUCTION ? baseBackUrlProd : baseBackUrlDev,
  useFrontendSchedule: USE_FRONTEND_SCHEDULE,
}
