<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../auth/mockAuth'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await loginUser(email.value, password.value)
    router.push('/admin')
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
            <h1 class="h4 mb-3">Admin Login</h1>

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
                  {{ isLoading ? 'Logging in...' : 'Admin Login' }}
                </button>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>