<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, useAuth } from '../auth/mockAuth'
import { SERVICE_OPTIONS } from '../data/jobs'

const router = useRouter()
const auth = useAuth()

const form = reactive({
  accountType: 'customer',
  name: '',
  businessName: '',
  email: '',
  password: '',
  phone: '',
  serviceAreas: '',
  services: ['Roof Repair'],
  availability: '',
  pricingRange: '',
})

const errorMessage = ref('')
const isLoading = ref(false)

function parseCommaList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

async function waitForRole() {
  for (let i = 0; i < 20; i += 1) {
    if (auth.currentUser?.role) {
      return auth.currentUser.role
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  return null
}

async function handleCreateAccount() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const isContractor = form.accountType === 'contractor'

    await registerUser({
      name: form.name,
      businessName: isContractor ? form.businessName : '',
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: isContractor ? 'contractor' : 'guest',
      serviceAreas: isContractor ? parseCommaList(form.serviceAreas) : [],
      services: isContractor ? form.services : [],
      availability: isContractor ? parseCommaList(form.availability) : [],
      pricingRange: isContractor ? form.pricingRange : '',
    })

    const role = await waitForRole()

    if (role === 'contractor') {
      router.push('/contractor')
    } else {
      router.push('/customer/home')
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to create account.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <article class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h1 class="h4 mb-3">Create Account</h1>
            <p class="text-secondary mb-3">Choose customer account or register a contractor business.</p>

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <form class="row g-3" @submit.prevent="handleCreateAccount">
              <div class="col-12">
                <label class="form-label" for="accountType">Account type</label>
                <select id="accountType" v-model="form.accountType" class="form-select">
                  <option value="customer">Customer</option>
                  <option value="contractor">Contractor business</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" required />
              </div>

              <div v-if="form.accountType === 'contractor'" class="col-12">
                <label class="form-label">Business name</label>
                <input v-model="form.businessName" class="form-control" required />
              </div>

              <div class="col-12">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required />
              </div>

              <div class="col-12">
                <label class="form-label">Password</label>
                <input v-model="form.password" type="password" class="form-control" required />
              </div>

              <div class="col-12">
                <label class="form-label">Phone</label>
                <input v-model="form.phone" class="form-control" />
              </div>

              <template v-if="form.accountType === 'contractor'">
                <div class="col-12">
                  <label class="form-label" for="services">Services offered</label>
                  <select id="services" v-model="form.services" class="form-select" multiple required>
                    <option v-for="service in SERVICE_OPTIONS" :key="service" :value="service">{{ service }}</option>
                  </select>
                  <p class="small text-secondary mt-1 mb-0">Hold Ctrl or Cmd to select multiple services.</p>
                </div>

                <div class="col-12">
                  <label class="form-label" for="serviceAreas">Service areas</label>
                  <input
                    id="serviceAreas"
                    v-model="form.serviceAreas"
                    class="form-control"
                    placeholder="Downtown, Northside, West End"
                    required
                  />
                </div>

                <div class="col-12">
                  <label class="form-label" for="availability">Availability slots</label>
                  <input
                    id="availability"
                    v-model="form.availability"
                    class="form-control"
                    placeholder="Mon 9:00 AM, Tue 1:30 PM"
                    required
                  />
                </div>

                <div class="col-12">
                  <label class="form-label" for="pricingRange">Pricing range</label>
                  <input
                    id="pricingRange"
                    v-model="form.pricingRange"
                    class="form-control"
                    placeholder="$200-$500 inspection"
                    required
                  />
                </div>
              </template>

              <div class="col-12">
                <button class="btn btn-dark w-100" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Creating...' : form.accountType === 'contractor' ? 'Register Business' : 'Create Account' }}
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>