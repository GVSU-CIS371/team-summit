<script setup>
import { computed } from 'vue'
import { useAuth, logout } from './auth/mockAuth'

const auth = useAuth()

const isAdmin = computed(() => auth.currentUser?.role === 'contractor')
</script>

<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg border-bottom bg-white sticky-top">
      <div class="container">
        <RouterLink class="navbar-brand fw-semibold" to="/">Team Summit Roofing</RouterLink>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <RouterLink class="btn btn-sm btn-outline-secondary" to="/">Home</RouterLink>

          <RouterLink v-if="!isAdmin" class="btn btn-sm btn-dark" to="/admin-login">Admin Login</RouterLink>

          <RouterLink v-else class="btn btn-sm btn-outline-dark" to="/contractor">Dashboard</RouterLink>

          <button v-if="isAdmin" class="btn btn-sm btn-outline-danger" @click="logout">Logout</button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
