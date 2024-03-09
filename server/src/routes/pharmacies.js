import { getPharmacies, postPharmacy, putPharmacy } from '../controllers/pharmacies.js'

const pharmaciesRoutes = async (app) => {
  app.get('/getPharmacies', getPharmacies)
  app.post('/postPharmacy', postPharmacy)
  app.put('/putPharmacy/:id', putPharmacy)
}


export default pharmaciesRoutes