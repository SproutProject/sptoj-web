import './styles/styles.less'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Index from './Index.vue'
import Task from './Task.vue'
import Ingress from './Ingress.vue'
import FormInput from './components/FormInput.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/info', component: Index },
    { path: '/status', component: Index },
    { path: '/task', component: Task },
    { path: '/ingress', component: Ingress }
  ]
})

Vue.component('form-input', FormInput)

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
