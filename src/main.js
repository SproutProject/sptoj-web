import './styles/styles.less'
require("babel-core/register");
require("babel-polyfill");
import Vue from 'vue'
import VueRouter from 'vue-router'
import FormInput from './components/FormInput.vue'
import * as API from './API.ts'
import * as UserService from './UserService.ts'
import App from './App.vue'
import Index from './Index.vue'
import Ingress from './Ingress.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/info', component: Index },
    { path: '/status', component: Index },
    { path: '/ingress', component: Ingress }
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
