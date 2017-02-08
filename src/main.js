import './styles/styles.less'
import './hook.js'
import 'babel-core/register'
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import FormInput from './components/FormInput.vue'
import * as API from './api.ts'
import * as UserService from './user-service.ts'
import App from './App.vue'
import Index from './Index.vue'
import Ingress from './Ingress.vue'
import GroupBoard from './GroupBoard.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/info', component: Index },
    { path: '/status', component: Index },
    { path: '/ingress', component: Ingress },
    { path: '/groups', component: GroupBoard }
  ]
})

Vue.component('form-input', FormInput)

API.emit('/user/get').then(user => {
  if (user != 'Error') {
    UserService.initialize(user);
  }

  new Vue({
    el: '#app',
    render: h => h(App),
    router
  })
})
