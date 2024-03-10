import Pharmacy from '../models/Pharmacy.js'

export const getMedication = async (request, reply) => {
  try {
    const medicationId = request.params.id
    const pharmacy = await Pharmacy.findOne({ 'medications._id': medicationId })
    const medication = pharmacy.medications.find(med => med._id.equals(medicationId))
    reply.send(medication)
  } catch (err) {
    reply.send('Error during getting medication', err)
  }
}
