import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "../components/login";
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect:'/login'
  },
  {
    path:'/login',
    component:login
  },
  {
    path:'/home',
    component:()=>import('../views/home/Home'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:()=>import('../views/home/welcome')
      },
      {
        path: '/users',
        component:()=>import('../views/childComps/users/Users')
      },
      {
        path:'/roles',
        component:()=>import('../views/childComps/limits/Roles')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  const token=window.sessionStorage.getItem('token')
  if(!token) return next('/login')
   next()
})

export default router
