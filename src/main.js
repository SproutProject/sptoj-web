import './styles/styles.less'
import './hook.js'
import 'babel-core/register'
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import FormInput from './components/FormInput.vue'
import * as API from './api.ts'
import * as UserSrv from './user-service.ts'
import App from './App.vue'
import Index from './Index.vue'
import Ingress from './Ingress.vue'
import GroupBoard from './GroupBoard.vue'
import Profile from './Profile.vue'
import Manage from './Manage.vue'
import GroupManage from './GroupManage.vue'
import ProblemManage from './ProblemManage.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/info', component: Index },
    { path: '/status', component: Index },
    { path: '/ingress', component: Ingress },
    { path: '/groups', component: GroupBoard },
    { path: '/profile', component: Profile },
    {
      path: '/manage',
      component: Manage,
      children: [
        { path: 'group', component: GroupManage },
        { path: 'group/:proset_uid', component: GroupManage },
        { path: 'problem', component: ProblemManage },
      ]
    },
  ]
})

Vue.component('form-input', FormInput)

API.emit('/user/get').then(user => {
  if (user != 'Error') {
    UserSrv.initialize(user);
  }
  new Vue({
    el: '#app',
    render: h => h(App),
    router
  })
})
