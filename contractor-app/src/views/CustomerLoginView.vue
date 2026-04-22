<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, useAuth } from '../auth/mockAuth'

const router = useRouter()
const auth = useAuth()
const form = reactive({
  email: '',
  password: '',
})
const errorMessage = ref('')
const isLoading = ref(false)

async function waitForUserRole() {
  for (let i = 0; i < 20; i++) {
    if (auth.currentUser?.role) return auth.currentUser.role
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  return null
}

async function login() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await loginUser(form.email, form.password)
    const role = await waitForUserRole()

    if (role === 'client') {
      router.push('/customer/home')
    } else if (role === 'contractor') {
      router.push('/admin')
    } else {
      errorMessage.value = 'Your account role was not found in Firestore.'
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
            <h1 class="h4 mb-3">Customer Login</h1>

            <p class="small text-secondary mb-3">
              Demo credentials: customer@teamsummitroofing.com or admin@teamsummitroofing.com / roofing123
            </p>

            <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>

            <form class="row g-3" @submit.prevent="login">
              <div class="col-12">
                <label class="form-label" for="email">Email</label>
                <input id="email" v-model="form.email" class="form-control" type="email" required />
              </div>

              <div class="col-12">
                <label class="form-label" for="password">Password</label>
                <input id="password" v-model="form.password" class="form-control" type="password" required />
              </div>

              <div class="col-12 d-flex gap-2">
                <button class="btn btn-dark" type="submit">Login as Customer</button>
                <RouterLink class="btn btn-outline-secondary" to="/">Back to home</RouterLink>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>
