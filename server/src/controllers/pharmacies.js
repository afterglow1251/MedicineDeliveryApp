import Pharmacy  from '../models/Pharmacy.js'

export const postPharmacy = async (request, reply) => {
  const ph = new Pharmacy({
    name: request.body.name,
  })

  ph.medications.push({
    name: request.body.dname,
    price: request.body.dprice,
    number: request.body.number,
    img: request.body.img
  })


  await ph.save()

  reply.send('OK!')
}

export const putPharmacy = async (request, reply) => {
  try {
    const { name, price } = request.body

    if (!name || !price) {
      return reply.code(400).send('Missing required fields')
    }

    const ph = await Pharmacy.findOne({ _id: request.params.id })

    if (!ph) {
      return reply.code(404).send('Pharmacy not found')
    }

    ph.medications.push({
      name: name,
      price: price,
      number: request.body.number,
      img: request.body.img
    })

    await ph.save()

    reply.send('OK!')
  } catch (error) {
    console.error('Error in putPharmacy:', error)
    reply.code(500).send('Internal Server Error')
  }
}

export const getPharmacies = async (request, reply) => {
  try {
    const pharmacies = await Pharmacy.find()
    reply.send(pharmacies)
  } catch (err) {
    reply.send('Error during getting pharmacies')
  }
}


