import mongoose from 'mongoose'

const PurchaseSchema = new mongoose.Schema({
    customer: {
      name: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    medications: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export default mongoose.model('Purchase', PurchaseSchema)