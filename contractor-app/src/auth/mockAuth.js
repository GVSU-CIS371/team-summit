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
    name: role === 'contractor' ? 'Jordan Reyes' : 'Taylor Morgan',
    role,
  }
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
