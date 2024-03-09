import { getMedication } from '../controllers/medications.js'

const medicationsRoutes = async (app) => {
  app.get('/getMedication/:id', getMedication)
}


export default medicationsRoutes