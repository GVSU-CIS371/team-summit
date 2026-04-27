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

  const roleToName = {
    admin: 'Admin User',
    contractor: 'Jordan Reyes',
    client: 'Client User',
  }

  authState.currentUser = {
    uid: `${role}-001`,
    name: roleToName[role] || 'User',
    role,
  }
}

export function loginAsAdmin() {
  setDemoRole('admin')
}

export function loginAsContractor() {
  setDemoRole('contractor')
}

export function loginAsClient() {
  setDemoRole('client')
}

export function logout() {
  setDemoRole(null)
}
