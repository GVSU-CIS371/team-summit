<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, logout } from './auth/mockAuth'

const router = useRouter()
const auth = useAuth()

const isAdmin = computed(() => auth.currentUser?.role === 'contractor')
const isGuest = computed(() => auth.currentUser?.role === 'guest')

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
          <RouterLink v-if="isGuest" class="btn btn-sm btn-outline-secondary" to="/customer/home">Find a Roofer</RouterLink>
          <RouterLink v-if="isGuest" class="btn btn-sm btn-outline-secondary" to="/customer/quote">Submitted Requests</RouterLink>

          <RouterLink v-if="isAdmin" class="btn btn-sm btn-outline-dark" to="/contractor">Dashboard</RouterLink>

          <template v-if="!isAdmin && !isGuest">
            <RouterLink class="btn btn-sm contractor-btn" to="/contractor-login">Contractor Login</RouterLink>

            <RouterLink class="btn btn-sm customer-btn" to="/customer-login">Customer Login</RouterLink>

            <RouterLink class="btn btn-sm account-btn" to="/create-account">Create Account / Register Business</RouterLink>
          </template>

          <button v-if="isAdmin || isGuest" class="btn btn-sm btn-outline-danger" @click="logoutUser">Logout</button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
