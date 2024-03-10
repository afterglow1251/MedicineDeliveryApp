<template>

  <header-component />

  <spin-loader v-if='loading' />

  <div class='flex h-screen'>

    <!-- Customer Information -->
    <div class='p-4 pt-20 w-1/4 bg-gray-200'>
      <h2 class='text-lg font-bold mb-4 text-center'>Customer Information</h2>
      <form @submit.prevent='submitForm'>
        <div class='mb-4'>
          <label for='name' class='block text-sm font-medium text-gray-700'>Name</label>
          <input id='name' v-model='customer.name' @input='validateName'
                 class='mt-1 p-2 w-full rounded-lg border-gray-300' autocomplete='name'>
          <div v-if='customerDataErrors.name' class='mt-2 block text-sm font-medium text-red-500'>
            {{ customerDataErrors.name }}
          </div>
        </div>
        <div class='mb-4'>
          <label for='email' class='block text-sm font-medium text-gray-700'>Email</label>
          <input id='email' v-model='customer.email' @input='validateEmail'
                 class='mt-1 p-2 w-full rounded-lg border-gray-300' autocomplete='email'>
          <div v-if='customerDataErrors.email' class='mt-2 block text-sm font-medium text-red-500'>
            {{ customerDataErrors.email }}
          </div>
        </div>
        <div class='mb-4'>
          <label for='phone' class='block text-sm font-medium text-gray-700'>Phone</label>
          <input id='phone' v-model='customer.phone' @input='validatePhone'
                 class='mt-1 p-2 w-full rounded-lg border-gray-300' autocomplete='tel'>
          <div v-if='customerDataErrors.phone' class='mt-2 block text-sm font-medium text-red-500'>
            {{ customerDataErrors.phone }}
          </div>
        </div>
        <div class='mb-4'>
          <label for='address' class='block text-sm font-medium text-gray-700'>Address</label>
          <textarea id='address' v-model='customer.address' @input='validateAddress'
                    class='mt-1 p-2 w-full rounded-lg border-gray-300' style='min-height: 100px; max-height: 200px;'
                    autocomplete='address'></textarea>
          <div v-if='customerDataErrors.address' class='mt-2 block text-sm font-medium text-red-500'>
            {{ customerDataErrors.address }}
          </div>
        </div>
        <div class='flex flex-row justify-between items-center'>
          <div class='text-xl font-semibold text-green-500'>Total price: {{ totalPrice }}</div>
          <button type='submit' class='font-semibold bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>
            Submit
          </button>
        </div>
      </form>
    </div>

    <!-- Selected Medications -->
    <div class='p-4 pt-20 w-3/4 bg-white overflow-y-auto scrollable-container'>
      <h2 class='text-lg font-bold mb-4 text-center'>Selected Medications</h2>
      <div class='grid grid-cols-3 gap-4'>
        <div v-if='availableMedications.length' v-for='(medication, index) in availableMedications' :key='index'
             class='bg-gray-300 p-2 rounded-lg'>
          <div class='p-4'>
            <img :src='`/src/assets/medicationImages/${medication.img}`' alt='Medicine Image'
                 class='rounded-lg w-full h-56'>
          </div>
          <div class='pl-4 pb-2'>
            <div>{{ medication.name }}</div>

            <div class='mt-2 flex flex-row justify-between items-center'>
              <input type='number' min='1'
                     v-model='medication.choice' :id="'number' + index"
                     class='p-2 w-24 rounded-lg border-gray-300'>
              <div class='text-red-500 text-xl'>{{ medication.price * medication.choice }}$</div>
              <button @click='removeMedicationFromCart(medication)'
                      class='mr-4 bg-red-500 text-white px-2 py-1 rounded float-right hover:bg-red-600'>
                <i class='fas fa-trash-alt'></i>
              </button>
            </div>

          </div>

          <p v-if='invalidMedicationNumber(medication)' class='ml-4 text-red-500'>Invalid medication number</p>
          <p v-else-if='invalidNumbers(medication)' class='ml-4 text-red-500'>Exceeds available medication quantity</p>
        </div>
        <div v-else-if='!availableMedications.length && !loading'>
          The cart is empty
        </div>
      </div>
    </div>
  </div>

  <div v-if='displayErrorPopup' class='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'>
    <div class='bg-white p-8 rounded-lg text-center'>
      <p class='text-red-500'>{{ errorMessage }}</p>
      <p class='text-red-500'>The operation was unsuccessful</p>
      <button @click='displayErrorPopup=false; errorMessage=""'
              class='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 inline-block'>Got it
      </button>
    </div>
  </div>

  <div v-if='displaySuccessPopup' class='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50'>
    <div class='bg-white p-8 rounded-lg text-center'>
      <p class='text-green-500'>{{ successMessage }}</p>
      <button @click='displaySuccessPopup=false; successMessage=""'
              class='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 inline-block'>Got it
      </button>
    </div>
  </div>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import { makePurchase } from '../services/PurchaseService.js'
import SpinLoader from '../components/SpinLoader.vue'
import { getMedication } from '../services/MedicationService.js'


const customer = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const customerDataErrors = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const loading = ref(false)
const displayErrorPopup = ref(false)
const errorMessage = ref('')

const displaySuccessPopup = ref(false)
const successMessage = ref('')


const availableMedications = ref([])

onMounted(async () => {
  loading.value = true
  const selectedMedications = JSON.parse(localStorage.getItem('cart')) ?? []
  for (const item of selectedMedications) {
    const medication = await getMedication(item._id)
    const medicationWithChoice = { ...medication, choice: item.choice }
    availableMedications.value.push(medicationWithChoice)

  }
  loading.value = false
})


const totalPrice = computed(() => {
  return availableMedications.value.reduce((acc, item) => {
    return acc + (item.price * item.choice)
  }, 0)
})

const removeMedicationFromCart = (medication) => {
  availableMedications.value = availableMedications.value.filter(item => item._id !== medication._id)
  localStorage.setItem('cart', JSON.stringify(availableMedications))
}

const submitForm = async () => {
  customerDataErrors.value.name = ''
  customerDataErrors.value.email = ''
  customerDataErrors.value.phone = ''
  customerDataErrors.value.address = ''

  if (!customer.value.name) {
    customerDataErrors.value.name = 'Enter a name'
  }
  if (!customer.value.email) {
    customerDataErrors.value.email = 'Enter an email'
  }
  if (!customer.value.phone) {
    customerDataErrors.value.phone = 'Enter a phone number'
  }
  if (!customer.value.address) {
    customerDataErrors.value.address = 'Enter an address'
  }

  if (!customer.value.name || !customer.value.email || !customer.value.phone || !customer.value.address) {
    return
  }

  const emailRegex = /@/
  if (!emailRegex.test(customer.value.email)) {
    customerDataErrors.value.email = 'Invalid email'
    return
  }

  const phoneRegex = /^\+?[0-9]{10,}$/
  if (!phoneRegex.test(customer.value.phone)) {
    customerDataErrors.value.phone = 'Invalid phone number'
    return
  }

  if (availableMedications.value.some(medication => invalidNumbers(medication))) {
    displayErrorPopup.value = true
    errorMessage.value = 'Some medications exceed the available quantity'
    return
  }

  if (availableMedications.value.some(medications => invalidMedicationNumber(medications))) {
    displayErrorPopup.value = true
    errorMessage.value = 'Some medications have invalid medication quantity'
    return
  }

  if (!availableMedications.value.length) {
    displayErrorPopup.value = true
    errorMessage.value = 'The cart is empty'
    return
  }

  const medicationsWithoutNumber = availableMedications.value.map(medication => {
    const { number, ...rest } = medication
    return rest
  })

  loading.value = true
  try {
    const res = await makePurchase({ customer: customer.value, medications: medicationsWithoutNumber })
    if (res.status === 200) {
      localStorage.removeItem('cart')
      availableMedications.value = []
      displaySuccessPopup.value = true
      successMessage.value = 'The purchase is successful'
      customer.value.name = ''
      customer.value.email = ''
      customer.value.phone = ''
      customer.value.address = ''
      loading.value = false
    }
  } catch (err) {
    displayErrorPopup.value = true
    errorMessage.value = 'Something went wrong'
    loading.value = false
    location.reload()
  }

}

const invalidNumbers = (selectedMedication) => {
  return selectedMedication.choice > selectedMedication.number
}

watch(availableMedications, (newMedications) => {
  localStorage.setItem('cart', JSON.stringify(newMedications))
}, { deep: true })


const validateName = () => {
  if (!customer.value.name) {
    customerDataErrors.value.name = 'Enter a name'
  } else {
    customerDataErrors.value.name = ''
  }
}

const validateEmail = () => {
  if (!customer.value.email) {
    customerDataErrors.value.email = 'Enter an email'
  } else {
    const emailRegex = /@/
    if (!emailRegex.test(customer.value.email)) {
      customerDataErrors.value.email = 'Invalid email'
    } else {
      customerDataErrors.value.email = ''
    }
  }
}

const validatePhone = () => {
  if (!customer.value.phone) {
    customerDataErrors.value.phone = 'Enter a phone number'
  } else {
    const phoneRegex = /^\+?[0-9]{10,}$/
    if (!phoneRegex.test(customer.value.phone)) {
      customerDataErrors.value.phone = 'Invalid phone number'
    } else {
      customerDataErrors.value.phone = ''
    }
  }
}

const validateAddress = () => {
  if (!customer.value.address) {
    customerDataErrors.value.address = 'Enter an address'
  } else {
    customerDataErrors.value.address = ''
  }
}

const invalidMedicationNumber = (medication) => {
  const inputValue = medication.choice
  const regex = /[.,]/
  return regex.test(inputValue) || inputValue === '' || inputValue === 0
}

</script>
