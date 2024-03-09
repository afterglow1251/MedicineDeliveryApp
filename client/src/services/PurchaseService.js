import axios from 'axios'

export const makePurchase = async (data) => {
  try {
    return await axios.post('api/makePurchase', data)
  } catch (err) {
    console.log('Error makePurchase:', err)
  }
}

