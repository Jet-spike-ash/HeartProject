import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/back',
      component: Layout,
      // redirect: '/back/dashboard', // 默认跳转到子路由
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard.vue'),
          meta: {
            title: '数据分析',
            icon: 'PieChart',
          },
        },
        {
          path: 'knowledge',
          component: () => import('@/views/knowledge.vue'),
          meta: {
            title: '知识文章',
            icon: 'ChatLineSquare',
          },
        },
        {
          path: 'consolation',
          component: () => import('@/views/consolation.vue'),
          meta: {
            title: '咨询记录',
            icon: 'Service',
          },
        },
        {
          path: 'mood',
          component: () => import('@/views/mood.vue'),
          meta: {
            title: '情绪日志',
            icon: 'User',
          },
        },
      ],
    },
    {
      path: '/',
      redirect: '/back/dashboard', // 添加这一行
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          component: () => import('@/views/auth/Login.vue'),
          meta: {
            title: '登录',
          },
        },
        {
          path: 'register',
          component: () => import('@/views/auth/Register.vue'),
          meta: {
            title: '注册',
          },
        },
      ],
    },
  ],
})

export default router
