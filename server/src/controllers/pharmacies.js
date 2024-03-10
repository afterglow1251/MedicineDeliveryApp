import Pharmacy  from '../models/Pharmacy.js'

export const postPharmacy = async (request, reply) => {
  try {
    const newPharmacy = new Pharmacy({
      name: request.body.pharmacyName
    })

    const medication = {
      name: request.body.medicationName,
      price: request.body.medicationPrice,
      number: request.body.medicationNumber,
      img: request.body.medicationImg
    }

    newPharmacy.medications.push(medication)

    await newPharmacy.save()

    reply.send('Pharmacy and medication added successfully!')
  } catch (err) {
    reply.send('Error creating pharmacy and adding medication:', err)
  }
}

export const putPharmacy = async (request, reply) => {
  try {

    const pharmacy = await Pharmacy.findOne({ _id: request.params.id })

    if (!pharmacy) {
      return reply.code(404).send('Pharmacy not found')
    }

    pharmacy.medications.push({
      name: request.body.medicationName,
      price: request.body.medicationPrice,
      number: request.body.medicationNumber,
      img: request.body.medicationImg
    })

    await pharmacy.save()

    reply.send('Medication added successfully!')
  } catch (err) {
    reply.send('Error in putPharmacy:', err)
  }
}

export const getPharmacies = async (request, reply) => {
  try {
    const pharmacies = await Pharmacy.find()
    reply.send(pharmacies)
  } catch (err) {
    reply.send('Error during getting pharmacies', err)
  }
}


