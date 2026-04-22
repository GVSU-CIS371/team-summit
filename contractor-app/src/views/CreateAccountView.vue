<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '../auth/mockAuth'

async function login() {
  try {
    await loginUser(form.email, form.password)
    router.push('/customer/home')
  } catch (error) {
    errorMessage.value = error.message
  }
}

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
})

const errorMessage = ref('')
const isLoading = ref(false)

async function handleCreateAccount() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: 'client', // important
    })

    // redirect after signup
    router.push('/customer/home')
  } catch (error) {
    errorMessage.value = error?.message || 'Failed to create account'
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

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="handleCreateAccount" class="row g-3">
              <div class="col-12">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" required />
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

              <div class="col-12">
                <button class="btn btn-dark w-100" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Creating...' : 'Create Account' }}
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>