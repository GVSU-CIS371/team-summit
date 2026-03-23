import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../auth/mockAuth'
import ContractorDashboardView from '../views/ContractorDashboardView.vue'
import ContractorJobDetailView from '../views/ContractorJobDetailView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'

const routes = [
  {
    path: '/',
    redirect: '/contractor',
  },
  {
    path: '/contractor',
    name: 'contractor-dashboard',
    component: ContractorDashboardView,
    meta: { requiresRole: 'contractor' },
  },
  {
    path: '/contractor/jobs/:id',
    name: 'contractor-job-detail',
    component: ContractorJobDetailView,
    meta: { requiresRole: 'contractor' },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuth()
  const requiredRole = to.meta.requiresRole

  if (!requiredRole) {
    return true
  }

  if (!auth.currentUser || auth.currentUser.role !== requiredRole) {
    return { name: 'unauthorized' }
  }

  return true
})

export default router
