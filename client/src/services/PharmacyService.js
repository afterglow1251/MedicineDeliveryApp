import axios from 'axios'

export const getPharmacies = async () => {
  try {
    const res = await axios.get('api/getPharmacies')
    return res.data
  } catch (err) {
    console.log('Error getting pharmacies:', err)
  }
}

