const baseFrontUrlDev = 'http://localhost:5173'
const baseBackUrlDev = 'http://localhost:3005'

const baseFrontUrlProd = 'https://your-frontend-domain.com'
const baseBackUrlProd = 'https://your-backend-domain.com'

const USE_PRODUCTION = false

export const AppConfig = {
  baseFrontUrl: USE_PRODUCTION ? baseFrontUrlProd : baseFrontUrlDev,
  baseBackUrl: USE_PRODUCTION ? baseBackUrlProd : baseBackUrlDev,
}
