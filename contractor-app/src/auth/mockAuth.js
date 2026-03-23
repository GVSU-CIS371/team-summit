import { reactive } from 'vue'

const authState = reactive({
  currentUser: {
    uid: 'contractor-001',
    name: 'Jordan Reyes',
    role: 'contractor',
  },
})

export function useAuth() {
  return authState
}

export function setDemoRole(role) {
  authState.currentUser = {
    uid: `${role}-001`,
    name: role === 'contractor' ? 'Jordan Reyes' : 'Taylor Morgan',
    role,
  }
}
