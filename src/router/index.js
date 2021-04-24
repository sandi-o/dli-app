import Vue from 'vue'
import VueRouter from 'vue-router'
import {store} from '../store';

import Home from '../views/Home';
import Category from '../views/category/Index';
import Login from '../views/auth/Login';
import Todo from '../views/todo/Index';
import User from '../views/user/Index';

Vue.use(VueRouter)

const routes = [
    {
        path: '/category',
        name: 'Category',
        component: Category
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/todo',
        name: 'Todo',
        component: Todo
    },
    {
        path: '/users',
        name: 'User',
        component: User
    }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.getters['auth/isAuthenticated']) next({name:'Login'})
  else if (to.name === 'Login' && store.getters['auth/isAuthenticated']) next({name:'Home'})
  else next()
})

export default router