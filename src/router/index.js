import Vue from 'vue'
import VueRouter from 'vue-router'
import Bookshelf from '../components/user/bookshelf.vue'
import UserLibrary from '../components/user/userLibrary.vue'
import UserInformation from '../components/user/userInformation.vue'
import UserHomePage from '../components/user/userHomePage.vue'
import BorrowingHistory from '../components/user/borrowingHistory.vue'
import ModifyPassword from '../components/user/modifyPassword.vue'

import AdminHomePage from '../components/administrator/adminHomePage.vue'
import Announcement from '../components/administrator/announcement.vue'
import AdminLibrary from '../components/administrator/adminLibrary.vue'
import Borrowing from '../components/administrator/borrowing.vue'
import Returning from '../components/administrator/returning.vue'
import ShowUserInformation from '../components/administrator/showUserInformation.vue'
import Statistics from '../components/administrator/statistics.vue'
import AdminPassword from '../components/administrator/adminPassword.vue'
import ViewAnnouncement from '../components/user/viewAnnouncement.vue'
import InformationPage from '../components/user/informationPage.vue'
import OverdueManagement from '../components/administrator/overdueManagement.vue'
import ImportAndExport from '../components/administrator/importAndExport.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            roles: ['user', 'admin']
        },
        component: () =>
            import ('../components/Login.vue')
    },
    {
        path: '/waiting',
        name: 'waiting',
        component: () =>
            import ('../components/waiting.vue')
    },
    {
        path: '/userHome',
        name: 'UserHome',
        meta: {
            roles: ['user']
        },
        component: () =>
            import ('../components/user/userHome.vue'),
        children: [{
                path: '/bookshelf',
                component: Bookshelf,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/userLibrary',
                component: UserLibrary,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/userInformation',
                component: UserInformation,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/userHomePage',
                component: UserHomePage,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/borrowingHistory',
                component: BorrowingHistory,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/modifyPassword',
                component: ModifyPassword,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/viewAnnouncement',
                component: ViewAnnouncement,
                meta: {
                    roles: ['user']
                }
            },
            {
                path: '/informationPage',
                component: InformationPage,
                meta: {
                    roles: ['user']
                }
            }
        ]
    },
    {
        path: '/adminHome',
        name: 'AdminHome',
        meta: {
            roles: ['admin']
        },
        component: () =>
            import ('../components/administrator/adminHome.vue'),
        children: [{
                path: '/adminHomePage',
                component: AdminHomePage,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/announcement',
                component: Announcement,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/adminLibrary',
                component: AdminLibrary,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/borrowing',
                component: Borrowing,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/returning',
                component: Returning,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/showUserInformation',
                component: ShowUserInformation,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/statistics',
                component: Statistics,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/adminPassword',
                component: AdminPassword,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/overdueManagement',
                component: OverdueManagement,
                meta: {
                    roles: ['admin']
                },
            },
            {
                path: '/importAndExport',
                component: ImportAndExport,
                meta: {
                    roles: ['admin']
                },
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

//路由拦截需要用到导航守卫
router.beforeEach((to, from, next) => {
    //如果用户访问的登录页，直接放行
    // debugger
    if (to.path === '/waiting') return next();
    else if (to.path === '/login') return next();
    //获取用户角色
    let role = sessionStorage.getItem('role');
    //从sessionStorage中获取到保存的token值
    const tokenStr = sessionStorage.getItem('token');
    // debugger
    if (to.meta.roles && to.meta.roles.includes(role)) {
        //没有token，强制跳转到登录页面
        if (!tokenStr) return next('/login');
        next();
    } else {
        next({ path: '/login' })
    }
})

export default router