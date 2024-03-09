<template>
  <div>
    <header-component />

    <spin-loader v-if='loading'/>

    <div v-else class='flex h-screen'>

      <!-- Pharmacy Names -->
      <div class='p-4 pt-20 w-1/4 bg-gray-200 overflow-y-auto scrollable-container h-screen'>
        <h2 class='text-lg font-bold mb-4 text-center'>Pharmacies</h2>
        <div class='flex flex-col mb-2'>
          <button v-for='(pharmacy, index) in pharmacies' :key='index'
                  @click='setCurrentPharmacy(pharmacy)'
                  :class="{ 'bg-green-500': pharmacy === currentPharmacy,
                              'hover:bg-green-200': pharmacy !== currentPharmacy }"
                  class='rounded-lg bg-gray-300 text-gray-800 mb-2 p-2 hover:bg-green-500'>
            {{ pharmacy.name }}
          </button>
        </div>
      </div>

      <!-- medications -->
      <div class='p-4 pt-20 w-3/4 bg-white overflow-y-auto scrollable-container h-screen'>
        <div class='flex justify-between items-center mb-4'>
          <h2 class='text-lg font-bold text-center flex-grow'>Medications</h2>
          <div class='flex flex-row items-center'>
            <label for='sort'>Sort by</label>
            <select
              id='sort' v-model='sortBy' class='ml-2 p-2 border border-gray-300 rounded-lg'>
              <option value='priceDesc'>Price: High to Low</option>
              <option value='priceAsc'>Price: Low to High</option>
              <option value='dateOld'>Date: Old to New</option>
              <option value='dateNew'>Date: New to Old</option>
              <option value='favorite'>Favorites First</option>
            </select>
          </div>
        </div>
        <div class='grid grid-cols-3 gap-4'>
          <div v-if='medications.length' v-for='(medication, index) in sortedMedications' :key='index'
               class='bg-gray-300 p-2 rounded-lg'>
            <div class='p-4'>
              <img :src='`/src/assets/medicationImages/${medication.img}`' alt='Medicine Image'
                   class='rounded-lg w-full h-56'>
            </div>
            <div class='pl-4 pb-2'>
              <div class='flex flex-col gap-3.5'>
                <div class='flex flex-row justify-between'>
                  <div>{{ medication.name }}</div>
                  <button
                    @click='toggleFavorite(medication)'
                    class='text-white mr-4'>
                    <i class='fa-solid fa-star fa-xl' :style="{ color: medication.favorite ? 'yellow' : '' }"></i>
                  </button>
                </div>

                <div class='flex flex-row justify-between'>
                  <div class='text-red-500 text-xl'>{{ medication.price }}$</div>
                  <button
                    @click='addMedicationToCart(medication)'
                    class='text-white mr-4'>
                    <i class='fa-solid fa-cart-shopping fa-xl'
                       style='color: #00A046;'
                       onmouseover="this.style.color='green'"
                       onmouseout="this.style.color='#00A046'"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            No medications available
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import { getPharmacies } from '../services/PharmacyService.js'
import HeaderComponent from '../components/HeaderComponent.vue'
import SpinLoader from '../components/SpinLoader.vue'

const pharmacies = ref()
const currentPharmacy = ref(JSON.parse(localStorage.getItem('currentPharmacy')) || null)
const medications = ref()
const loading = ref(true)

onMounted(async () => {
  await loadPharmacies()
})

watch(currentPharmacy, (newPharmacy) => {
  medications.value = newPharmacy.medications.filter(medication => medication.number !== 0)

  let favorites = JSON.parse(localStorage.getItem('favorites')) || []

  medications.value.forEach(medication => {
    medication.favorite = favorites.includes(medication._id)
  })
})


const loadPharmacies = async () => {
  pharmacies.value = await getPharmacies()
  const currentPh = JSON.parse(localStorage.getItem('currentPharmacy'))
  if (currentPh) {
    currentPharmacy.value = pharmacies.value.find(item => item._id === currentPh._id)
  } else if (pharmacies.value.length) {
    currentPharmacy.value = pharmacies.value[0]
  }
  loading.value = false
}

const setCurrentPharmacy = async (pharmacy) => {
  currentPharmacy.value = pharmacy
  localStorage.setItem('currentPharmacy', JSON.stringify(pharmacy))
}

const addMedicationToCart = async (medication) => {
  const cart = JSON.parse(localStorage.getItem('cart')) ?? []

  const existingMedication = cart.find(item => item._id === medication._id)

  if (existingMedication) {
    console.log('Препарат вже є у кошику')
  } else {
    cart.push({ ...medication, choice: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    console.log('Препарат додано до кошика')
  }
}

const sortBy = ref(localStorage.getItem('sortBy') || 'priceAsc')

watch(sortBy, (newSortBy) => {
  localStorage.setItem('sortBy', newSortBy)
})


const sortedMedications = computed(() => {
  let sortedMeds = [...medications.value]

  if (sortBy.value === 'priceDesc') {
    sortedMeds.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'priceAsc') {
    sortedMeds.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'dateOld') {
    sortedMeds.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (sortBy.value === 'dateNew') {
    sortedMeds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortBy.value === 'favorite') {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []

    sortedMeds.sort((a) => {
      const isAFavorite = favorites.includes(a._id)
      return isAFavorite ? -1 : 1
    })
  }

  return sortedMeds
})


const toggleFavorite = (medication) => {
  medication.favorite = !medication.favorite
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []

  if (medication.favorite) {
    favorites.push(medication._id)
  } else {
    favorites = favorites.filter(fav => fav !== medication._id)
  }

  localStorage.setItem('favorites', JSON.stringify(favorites))
}

</script>

