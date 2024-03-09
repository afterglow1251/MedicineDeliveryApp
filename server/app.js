import Fastify from 'fastify'
import mongoose from 'mongoose'
import './config.js'
import pharmaciesRoutes from './src/routes/pharmacies.js'
import purchasesRoutes from './src/routes/puechases.js'
import medicationsRoutes from './src/routes/medications.js'

const app = Fastify()

app.register(pharmaciesRoutes, { prefix: '/api' })
app.register(purchasesRoutes, { prefix: '/api' })
app.register(medicationsRoutes, { prefix: '/api' })

mongoose.connect(process.env.MONGODB)
  .then(() => {
    console.log('Connected to MongoDB!')

    const port = process.env.PORT || 3000
    app.listen({ port: port }, (err, address) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`Server is running on port ${port}`)
        console.log(address)
      }
    })
  })

