import { reactive } from 'vue'

const authState = reactive({
  currentUser: null,
})

export function useAuth() {
  return authState
}

export function setDemoRole(role) {
  if (!role) {
    authState.currentUser = null
    return
  }

  authState.currentUser = {
    uid: `${role}-001`,
    name: role === 'admin' ? 'Admin User' : 'Jordan Reyes',
    role,
  }
}

export function loginAsAdmin() {
  setDemoRole('admin')
}

export function loginAsContractor() {
  setDemoRole('contractor')
}

export function loginAsGuest() {
  setDemoRole('guest')
}

export function logout() {
  setDemoRole(null)
}
