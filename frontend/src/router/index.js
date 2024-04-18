/**
 * Copyright 2022, The Johns Hopkins University Applied Physics Laboratory LLC
 * All rights reserved.
 * Distributed under the terms of the BSD 3-Clause License.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('@/views/Analysis')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('@/views/Results')
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
