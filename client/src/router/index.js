import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

import Home from '@/views/public/Home'

Vue.use(Router)

export const publicRouter = [
  { path: '/login', name: 'login', component: () => import('@/views/public/Login'), hidden: true },
  { path: '/404', name: '404', component: () => import('@/views/public/404'), hidden: true },
  { path: '/401', name: '401', component: () => import('@/views/public/401'), hidden: true },
  { path: '/lock', name: 'lock', component: () => import('@/views/public/Lock'), hidden: true },
  { path: '/refresh', component: () => import('@/views/public/Refresh'), name: 'refresh', hidden: true },
  { path: '*', component: () => import('@/views/public/404'), hidden: true }
]

export const currentRouter = [
  {
    path: '',
    component: Home,
    meta: {
      title: 'Home',
      icon: 'mdi-home'
    },
    redirect: 'index',
    children: [{
      path: 'index',
      component: () => import('@/views/public/Index'),
      name: 'index',
      meta: { title: 'Home', icon: 'mdi-home' }
    }]
  },
  {
    path: '/user',
    component: Home,
    redirect: '/user/index',
    show: true,
    name: 'user',
    meta: {
      title: 'User',
      icon: 'mdi-account-settings'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/Index.vue'),
        name: 'all-user',
        meta: { title: 'All_User', icon: 'mdi-account-group' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/user/Edit.vue'),
        name: 'edit-user',
        meta: { title: 'Edit_User', icon: 'edit' },
        hidden: true
      },
      {
        path: 'add',
        component: () => import('@/views/user/Add.vue'),
        name: 'add-user',
        meta: { title: 'Add_User', icon: 'add' },
        hidden: true
      }
    ]
  },
  {
    path: '/organization',
    component: Home,
    redirect: '/organization/department/index',
    name: 'organization',
    meta: {
      title: 'Organization',
      icon: 'mdi-sitemap'
    },
    children: [
      {
        path: 'department/index',
        component: () => import('@/views/organization/department/Index.vue'),
        name: 'department',
        meta: { title: 'Department', icon: 'mdi-puzzle' }
      },
      {
        path: 'position/index',
        component: () => import('@/views/organization/position/Index.vue'),
        name: 'position',
        meta: { title: 'Position', icon: 'mdi-account-card-details' }
      }
    ]
  },
  {
    path: '/system',
    component: Home,
    redirect: '/system/menu/index',
    name: 'system',
    meta: {
      title: 'System',
      icon: 'mdi-settings fa-spin'
    },
    children: [
      {
        path: 'menu/index',
        component: () => import('@/views/system/menu/Index.vue'),
        name: 'menu',
        meta: { title: 'Menu', icon: 'mdi-format-list-bulleted' }
      },
      {
        path: 'rule/index',
        component: () => import('@/views/system/rule/Index.vue'),
        name: 'rule',
        meta: { title: 'Rule', icon: 'mdi-account-key' }
      }
    ]
  }
]

export const router = new Router({
  mode: 'history',
  routes: publicRouter,
  scrollBehavior: () => ({ y: 0 })
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (sessionStorage.getItem('token')) {
    if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (!store.getters.getPrivateRouter.length) {
        store.dispatch('setPrivateRouter', {}).then(() => {
          router.addRoutes(store.getters.getPrivateRouter)
          next({ ...to, replace: true })
        })
      } else {
        if (JSON.stringify(to.meta) === '{}' && to.name) {
          next({path: '/404'})
        } else {
          next()
        }
      }
    }
  } else {
    if (to.path !== '/login') {
      next({path: '/login'})
    } else {
      next()
    }
  }
  NProgress.done()
})

router.afterEach(to => {
  NProgress.done()
})

export default router
