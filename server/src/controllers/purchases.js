import Purchase from '../models/Purchase.js'
import Pharmacy from '../models/Pharmacy.js'

export const makePurchase = async (request, reply) => {
  try {
    const { customer, medications } = request.body


    const idsMedications = new Map(medications.map(item => [item._id, item.choice]))
    for (const [id, choice] of idsMedications.entries()) {
      const pharmacy = await Pharmacy.findOne({ 'medications._id': id })
      const medication = pharmacy.medications.find(med => med._id.equals(id))
      if (medication.number < choice) {
        return reply.code(400).send('The entered medication number exceeds the maximum value in DB')
      }
    }

    for (const [id, choice] of idsMedications.entries()) {
      await Pharmacy.updateOne(
        { 'medications._id': id },
        { $inc: { 'medications.$.number': -choice } },
      )
    }

    const purchase = new Purchase({
      customer, medications,
    })

    await purchase.save()

    reply.send('Purchase is successful!')
  } catch (err) {
    reply.send('Error during purchasing', err)
  }

}
