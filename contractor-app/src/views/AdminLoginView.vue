<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginAsContractor } from '../auth/mockAuth'

const router = useRouter()
const form = reactive({
  email: '',
  password: '',
})
const errorMessage = ref('')

function login() {
  if (form.email !== 'admin@teamsummitroofing.com' || form.password !== 'roofing123') {
    errorMessage.value = 'Invalid admin credentials. Use the demo credentials shown below.'
    return
  }

  loginAsContractor()
  router.push('/contractor')
}
</script>

<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <article class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h1 class="h4 mb-3">Admin Login</h1>

            <p class="small text-secondary mb-3">
              Demo credentials: admin@teamsummitroofing.com / roofing123
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
                <button class="btn btn-dark" type="submit">Login as Admin</button>
                <RouterLink class="btn btn-outline-secondary" to="/">Back to home</RouterLink>
              </div>
            </form>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>
