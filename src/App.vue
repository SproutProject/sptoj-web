<template>
<div id="app">
  <div id="navbar">
    <div class="container"><div class="grid grid-noBottom">
      <router-link to="/" class="col-2 logo">Sprout OJ</router-link>
      <router-link to="/info" class="col-1 link">消息</router-link>
      <router-link to="/rank" class="col-1 link">積分</router-link>
      <router-link to="/status" class="col-1 link">狀態</router-link>
      <router-link to="/group" class="col-1 link">任務</router-link>
      <router-link to="/ingress" class="col link" data-push-left="off-4" v-if="!login">登入 | 註冊</router-link>
      <router-link to="/profile" class="col link" data-push-left="off-4" v-if="login">{{ name }}</router-link>
    </div></div>
  </div>
  <div id="view"  class="container">
    <router-view></router-view>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as UserSrv from './user-service.ts'

@Component
export default class App extends Vue {
  login: boolean = UserSrv.login
  name: string = UserSrv.identity.name
}
</script>
