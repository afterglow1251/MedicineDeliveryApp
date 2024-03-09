import mongoose from 'mongoose'

const MedicationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  })


const PharmacySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    medications: [MedicationSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default mongoose.model('Pharmacy', PharmacySchema)