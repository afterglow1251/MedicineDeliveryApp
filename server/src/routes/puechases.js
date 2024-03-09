import { makePurchase } from '../controllers/purchases.js'

const purchasesRoutes = async (app) => {
  app.post('/makePurchase', makePurchase)
}


export default purchasesRoutes