import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Auth/LoginView.vue'

// Ambil user dari localStorage (kalau ada)
function getUserRole() {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?.role?.slug?.toLowerCase() || null
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ---------------------------------
    // AUTH
    // ---------------------------------
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    // ---------------------------------
    // ADMIN ROUTES
    // ---------------------------------
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/admin/DashboardAdmin.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/employees',
      name: 'admin-employees',
      component: () => import('../views/admin/EmployeeListView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/leaves',
      name: 'admin-leaves',
      component: () => import('../views/admin/ListofLeaveView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/leaves/request',
      name: 'admin-request-leaves',
      component: () => import('../views/admin/RequestLeaveView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/leaves/history',
      name: 'admin-history-leaves',
      component: () => import('../views/admin/HistoryLeaveView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/special-leave',
      name: 'admin-special-leaves',
      component: () => import('../views/admin/SpecialLeaveView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/mandatory',
      name: 'admin-mandatory',
      component: () => import('../views/admin/MandatoryView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/adjust-balance',
      name: 'admin-adjust-balance',
      component: () => import('../views/admin/AdjustBalanceView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/adjust-history',
      name: 'admin-adjust-history',
      component: () => import('../views/admin/AdjustHistoryView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/information',
      name: 'admin-information',
      component: () => import('../views/admin/InformationView.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },

    // ---------------------------------
    // USER ROUTES
    // ---------------------------------
    {
      path: '/user/dashboard',
      name: 'user-dashboard',
      component: () => import('../views/user/DashboardUser.vue'),
      meta: { requiresAuth: true, role: 'user' },
    },
    {
      path: '/user/history',
      name: 'user-history',
      component: () => import('../views/user/HistoryLeaveView.vue'),
      meta: { requiresAuth: true, role: 'user' },
    },
    {
      path: '/user/mandatory',
      name: 'user-mandatory',
      component: () => import('../views/user/MandatoryLeaveView.vue'),
      meta: { requiresAuth: true, role: 'user' },
    },
    {
      path: '/user/adjust-history',
      name: 'user-adjust-history',
      component: () => import('../views/user/AdjustHistoryView.vue'),
      meta: { requiresAuth: true, role: 'user' },
    },
    {
      path: '/user/information',
      name: 'user-information',
      component: () => import('../views/user/InformationView.vue'),
      meta: { requiresAuth: true, role: 'user' },
    },

    // ---------------------------------
    // DEFAULT / CATCH ALL
    // ---------------------------------
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

// ======================================
// GLOBAL NAVIGATION GUARD
// ======================================
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const userRole = getUserRole()

  if (requiresAuth && !userRole) {
    // belum login
    next('/login')
  } else if (to.name === 'login' && userRole) {
    // kalau udah login tapi buka /login lagi
    if (userRole === 'admin') next('/admin/dashboard')
    else next('/user/dashboard')
  } else if (requiresAuth && to.meta.role && to.meta.role !== userRole) {
    // role tidak sesuai
    next('/login')
  } else {
    next()
  }
})

export default router
