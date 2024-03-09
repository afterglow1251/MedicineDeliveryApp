import axios from 'axios'

export const getMedication = async (medicationId) => {
  try {
    const res = await axios.get(`api/getMedication/${medicationId}`)
    return res.data
  } catch (err) {
    console.log('Error getting pharmacies:', err)
  }
}

