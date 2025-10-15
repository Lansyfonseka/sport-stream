const baseFrontUrlDev = 'http://localhost:5173'
const baseBackUrlDev = 'http://localhost:3005'

const baseFrontUrlProd = 'http://193.227.240.252:5173'
const baseBackUrlProd = 'http://193.227.240.252:3005'

const USE_PRODUCTION = true

export const AppConfig = {
  baseFrontUrl: USE_PRODUCTION ? baseFrontUrlProd : baseFrontUrlDev,
  baseBackUrl: USE_PRODUCTION ? baseBackUrlProd : baseBackUrlDev,
}
