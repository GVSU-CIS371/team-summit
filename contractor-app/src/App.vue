<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth, logout } from './auth/mockAuth'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const isAdmin = computed(() => auth.currentUser?.role === 'contractor')
const isGuest = computed(() => auth.currentUser?.role === 'guest')
const isLoggedIn = computed(() => Boolean(auth.currentUser))
const showDashboardButton = computed(() => isLoggedIn.value && route.path !== '/admin')
const showLogout = computed(() => {
  if (!isLoggedIn.value) {
    return false
  }
  return route.path === '/' || route.path === '/admin'
})

function logoutUser() {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg border-bottom bg-white sticky-top">
      <div class="container">
        <RouterLink class="navbar-brand fw-semibold" to="/">Team Summit Roofing</RouterLink>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <RouterLink v-if="isGuest" class="btn btn-sm btn-outline-secondary" to="/customer/about">About Us</RouterLink>
          <RouterLink v-if="isGuest" class="btn btn-sm btn-outline-secondary" to="/customer/home">Submit a request</RouterLink>
          <RouterLink v-if="isGuest" class="btn btn-sm btn-outline-secondary" to="/customer/quote">Quote</RouterLink>

          <RouterLink v-if="isAdmin" class="btn btn-sm btn-outline-dark" to="/contractor">Dashboard</RouterLink>

          <template v-if="!isAdmin && !isGuest">
            <RouterLink class="btn btn-sm btn-dark" to="/admin-login">Admin Login</RouterLink>
            <RouterLink class="btn btn-sm btn-outline-primary" to="/customer-login">Customer Login</RouterLink>
            <RouterLink class="btn btn-sm btn-outline-secondary" to="/create-account">Create Account</RouterLink>
          </template>

          <button v-if="isAdmin || isGuest" class="btn btn-sm btn-outline-danger" @click="logoutUser">Logout</button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
