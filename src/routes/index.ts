// import vue router
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

//import js cookies
import Cookie from 'js-cookie'

// Utility to get the token
const getToken = () => Cookie.get('token')

// define routes with proper type
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ '../views/auth/register.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/auth/login.vue')
    },
    {
        path: '/admin/dashboard',
        name: 'dashboard',
        component: () => import( /* webpackChunkName: "home" */ '../views/admin/dashboard/index.vue'),
        meta: { requiresAuth: true } // <-- Add meta field
    },
]

// create router
const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Global navigation guard
router.beforeEach((to, _from, next) => {
    // Ambil token otentikasi pengguna
    const token = getToken();

    // Jika rute tujuan membutuhkan otentikasi dan pengguna tidak memiliki token
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        // Alihkan pengguna ke halaman login
        next({ name: 'login' });
    } 
    // Jika rute tujuan adalah halaman login atau register dan pengguna sudah login
    else if ((to.name === 'login' || to.name === 'register') && token) {
        // Alihkan pengguna ke halaman dashboard
        next({ name: 'dashboard' });
    } 
    // Jika tidak ada kondisi khusus, izinkan navigasi ke rute tujuan
    else {
        next();
    }
});

export default router