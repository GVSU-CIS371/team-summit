<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuth, logout } from './auth/mockAuth'

const auth = useAuth()
const route = useRoute()
const router = useRouter()

const isClient = computed(() => auth.currentUser?.role === 'client')
const isContractor = computed(() => auth.currentUser?.role === 'contractor')

async function handleLogout() {
  await logout()
  router.push('/')
}

</script>

<template>
  <div class="app-shell">
    <header class="border-bottom bg-white" v-if="route.name !== 'landing'">
      <nav class="container py-3 d-flex justify-content-between align-items-center">
        <RouterLink to="/" class="navbar-brand fw-bold text-decoration-none text-dark">
          Team Summit Roofing
        </RouterLink>

        <div class="d-flex gap-2 align-items-center">
          <template v-if="isClient">
            <RouterLink to="/customer/home" class="btn btn-outline-dark btn-sm">Home</RouterLink>
            <RouterLink to="/customer/about" class="btn btn-outline-dark btn-sm">About</RouterLink>
            <RouterLink to="/customer/quote" class="btn btn-outline-dark btn-sm">Request Quote</RouterLink>
          </template>

          <template v-if="isContractor">
            <RouterLink to="/admin" class="btn btn-outline-dark btn-sm">Admin</RouterLink>
            <RouterLink to="/contractor" class="btn btn-outline-dark btn-sm">Contractor</RouterLink>
          </template>

          <button
            v-if="auth.currentUser"
            class="btn btn-dark btn-sm"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
