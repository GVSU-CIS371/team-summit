<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, logout, useAuth } from '../auth/mockAuth'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const auth = useAuth()

async function waitForRole() {
  for (let i = 0; i < 20; i++) {
    if (auth.currentUser?.role) return auth.currentUser.role
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  return null
}

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await loginUser(email.value, password.value)
    const role = await waitForRole()

    if (role === 'contractor') {
      router.push('/contractor')
    } else {
      await logout()
      errorMessage.value = 'This account does not have contractor access.'
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Login failed.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <article class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h1 class="h4 mb-3">Contractor Login</h1>

            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <form class="row g-3" @submit.prevent="handleLogin">
              <div class="col-12">
                <label class="form-label" for="email">Email</label>
                <input id="email" v-model="email" class="form-control" type="email" required />
              </div>

              <div class="col-12">
                <label class="form-label" for="password">Password</label>
                <input id="password" v-model="password" class="form-control" type="password" required />
              </div>

              <div class="col-12">
                <button class="btn btn-dark w-100" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Logging in...' : 'Contractor Login' }}
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>