<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, logout } from './auth/mockAuth'

const router = useRouter()
const auth = useAuth()
const isDarkMode = ref(false)

const isAdmin = computed(() => auth.currentUser?.role === 'contractor')
const isGuest = computed(() => auth.currentUser?.role === 'guest')
const canSeeAboutUs = computed(() => auth.currentUser?.role !== 'admin')

function logoutUser() {
  logout()
  router.push('/')
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
}

onMounted(() => {
  const savedTheme = window.localStorage.getItem('theme')
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  isDarkMode.value = savedTheme ? savedTheme === 'dark' : prefersDark
})

watch(
  isDarkMode,
  (enabled) => {
    document.documentElement.dataset.theme = enabled ? 'dark' : 'light'
    document.documentElement.style.colorScheme = enabled ? 'dark' : 'light'
    window.localStorage.setItem('theme', enabled ? 'dark' : 'light')
  },
  { immediate: true }
)
</script>

<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg border-bottom bg-white sticky-top">
      <div class="container">
        <RouterLink class="navbar-brand fw-semibold" to="/">Team Summit Roofing</RouterLink>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <RouterLink v-if="canSeeAboutUs" class="btn btn-sm account-btn" to="/customer/about">About Us</RouterLink>
          <RouterLink v-if="isGuest" class="btn btn-sm customer-btn" to="/customer/home">Find a Roofer</RouterLink>
          <RouterLink v-if="isGuest" class="btn btn-sm contractor-btn" to="/customer/quote">Submitted Requests</RouterLink>

          <RouterLink v-if="isAdmin" class="btn btn-sm contractor-btn" to="/contractor">Dashboard</RouterLink>

          <template v-if="!isAdmin && !isGuest">
            <RouterLink class="btn btn-sm contractor-btn" to="/contractor-login">Contractor Login</RouterLink>
            <RouterLink class="btn btn-sm customer-btn" to="/customer-login">Customer Login</RouterLink>
            <RouterLink class="btn btn-sm account-btn" to="/create-account">Create Account / Register Business</RouterLink>
            <button type="button" class="btn btn-sm theme-btn" @click="toggleDarkMode">
              {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
            </button>
          </template>

          <button v-if="isAdmin || isGuest" class="btn btn-sm btn-outline-danger" @click="logoutUser">Logout</button>
          <button v-if="isAdmin || isGuest" type="button" class="btn btn-sm theme-btn" @click="toggleDarkMode">
            {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
          </button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>
