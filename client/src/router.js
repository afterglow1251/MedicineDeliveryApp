import { createRouter, createWebHistory } from 'vue-router'
import ShopPage from './pages/ShopPage.vue'
import CartPage from './pages/CartPage.vue'


export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'ShopPage',
      path: '/',
      component: ShopPage,
    },
    {
      name: 'CartPage',
      path: '/cart',
      component: CartPage,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})