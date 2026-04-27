<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth, logout } from './auth/mockAuth'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const isLoggedIn = computed(() => Boolean(auth.currentUser))
const currentRole = computed(() => auth.currentUser?.role || null)
const showAdminDashboardButton = computed(() => currentRole.value === 'admin' && route.path !== '/admin')
const showContractorDashboardButton = computed(() => currentRole.value === 'contractor' && route.path !== '/contractor')
const showLogout = computed(() => isLoggedIn.value)

function handleLogout() {
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
          <RouterLink v-if="!isLoggedIn" class="btn btn-sm btn-dark" to="/admin-login">Admin Login</RouterLink>
          <RouterLink v-if="!isLoggedIn" class="btn btn-sm btn-outline-dark" to="/contractor-login">Contractor Login</RouterLink>
          <RouterLink v-if="showAdminDashboardButton" class="btn btn-sm btn-outline-dark" to="/admin">Admin Dashboard</RouterLink>
          <RouterLink v-if="showContractorDashboardButton" class="btn btn-sm btn-outline-dark" to="/contractor">Contractor Dashboard</RouterLink>
          <button v-if="showLogout" class="btn btn-sm btn-outline-danger" @click="handleLogout">Logout</button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
