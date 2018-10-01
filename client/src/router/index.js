import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import comps from '@/utils/components'
import util from '@/utils'
Vue.use(Router)

export const publicRouter = [
  { path: '/login', component: () => import('@/views/public/Login'), hidden: true },
  { path: '/404', component: () => import('@/views/public/404'), hidden: true },
  { path: '/401', component: () => import('@/views/public/401'), hidden: true },
  { path: '/lock', component: () => import('@/views/public/Lock'), hidden: true },
  { path: '/refresh', component: () => import('@/views/public/Refresh'), name: 'refresh', hidden: true },
  { path: '*', component: () => import('@/views/public/404'), hidden: true }
]

export const currentRouter = [
  {
    path: '',
    component: comps['home'],
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
  }
  // {
  //   path: '/organization',
  //   component: home,
  //   redirect: '/organization/department/index',
  //   name: 'organization',
  //   meta: {
  //     title: 'Organization',
  //     icon: 'mdi-sitemap'
  //   },
  //   children: [
  //     {
  //       path: 'department/index',
  //       component: () => import('@/views/organization/department/Index.vue'),
  //       name: 'department',
  //       meta: { title: 'Department', icon: 'mdi-puzzle' }
  //     },
  //     {
  //       path: 'position/index',
  //       component: () => import('@/views/organization/position/Index.vue'),
  //       name: 'position',
  //       meta: { title: 'Position', icon: 'mdi-account-card-details' }
  //     },
  //     {
  //       path: 'user/index',
  //       component: () => import('@/views/organization/user/Index.vue'),
  //       name: 'user',
  //       meta: { title: 'User', icon: 'mdi-account-group' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: home,
  //   redirect: '/system/menu/index',
  //   name: 'system',
  //   meta: {
  //     title: 'System',
  //     icon: 'mdi-settings'
  //   },
  //   children: [
  //     {
  //       path: 'menu/index',
  //       component: () => import('@/views/system/menu/Index.vue'),
  //       name: 'menu',
  //       meta: { title: 'Menu', icon: 'mdi-format-list-bulleted' }
  //     },
  //     {
  //       path: 'menu/add',
  //       component: () => import('@/views/system/menu/Add.vue'),
  //       name: 'addMenu',
  //       meta: { title: 'addMenu' },
  //       hidden: true
  //     },
  //     {
  //       path: 'rule/index',
  //       component: () => import('@/views/system/rule/Index.vue'),
  //       name: 'rule',
  //       meta: { title: 'Rule', icon: 'mdi-account-key' }
  //     },
  //     {
  //       path: 'rule/add',
  //       component: () => import('@/views/system/rule/Add.vue'),
  //       name: 'addRule',
  //       meta: { title: 'addRule' },
  //       hidden: true
  //     },
  //     {
  //       path: 'setting/index',
  //       component: () => import('@/views/system/setting/Index.vue'),
  //       name: 'setting',
  //       meta: { title: 'Setting', icon: 'mdi-circle-edit-outline' }
  //     }
  //   ]
  // }
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
      if (!store.getters.getUserInfo.length) {
        let user = JSON.parse(sessionStorage.getItem('user'))
        store.dispatch('setUserInfo', user)
      }
      if (!store.getters.getSetting.length) {
        let setting = JSON.parse(sessionStorage.getItem('setting'))
        store.dispatch('setSetting', setting)
      }
      if (!store.getters.getPrivateRouter.length) {
        let r = util.setMenus()
        if (r) {
          store.dispatch('setPrivateRouter', r).then(() => {
            router.addRoutes(store.getters.getPrivateRouter)
            next({ ...to, replace: true })
          })
        } else {
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('menus')
          store.dispatch('setPrivateRouter', null)
          next({path: '/login'})
        }
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
