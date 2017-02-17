import './styles/styles.less'
import 'babel-core/register'
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import FormInput from './components/FormInput'
import FormLabel from './components/FormLabel'
import * as API from './api'
import * as UserSrv from './user-service'
import App from './App'
import Index from './Index'
import Ingress from './Ingress'
import GroupBoard from './GroupBoard'
import Group from './Group'
import Problem from './Problem'
import ChallengeBoard from './ChallengeBoard'
import Challenge from './Challenge'
import Profile from './Profile'
import Manage from './Manage'
import GroupManage from './GroupManage'
import ProblemManage from './ProblemManage'
import UserManage from './UserManage'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Index },
    { path: '/info', component: Index },
    { path: '/status/:off?', component: ChallengeBoard },
    { path: '/ingress', component: Ingress },
    {
      path: '/group',
      component: GroupBoard,
      children: [
        { path: ':proset_uid', component: Group },
      ],
    },
    { path: '/problem/:problem_uid/:view?', component: Problem },
    { path: '/challenge/:challenge_uid/', component: Challenge },
    { path: '/profile/:user_uid?/', component: Profile },
    {
      path: '/manage',
      component: Manage,
      children: [
        { path: 'group', component: GroupManage },
        { path: 'group/:proset_uid', component: GroupManage },
        { path: 'problem', component: ProblemManage},
        { path: 'user', component: UserManage },
      ],
    },
  ]
})

Vue.component('form-input', FormInput)
Vue.component('form-label', FormLabel)

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
