<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, useAuth } from '../auth/mockAuth'

const router = useRouter()
const auth = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function waitForUserRole() {
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
    const role = await waitForUserRole()

    if (role === 'contractor') {
      router.push('/admin')
    } else if (role === 'client') {
      router.push('/customer/home')
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
  <div class="admin-login-page">
    <div class="login-card">
      <h1>Admin Login</h1>
      <p class="subtitle">Sign in to access the admin dashboard.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0 0 0.5rem;
}

.subtitle {
  margin-bottom: 1.5rem;
  color: #666;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.form-control {
  padding: 0.8rem 0.9rem;
  border: 1px solid #d0d7de;
  border-radius: 10px;
  font-size: 1rem;
}

.error-message {
  margin: 0;
  color: #c62828;
  font-size: 0.95rem;
}

.login-button {
  border: none;
  border-radius: 10px;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
