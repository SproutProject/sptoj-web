<template>
<div id="app">
  <div id="navbar">
    <div class="container"><div class="grid grid-noBottom">
      <router-link to="/" class="col-2 logo">Sprout OJ</router-link>
      <div class="col grid">
        <router-link to="/info/" class="col-1 link">Informa</router-link>
        <router-link to="/rank/" class="col-1 link">Ranking</router-link>
        <router-link to="/status/" class="col-1 link">Status</router-link>
        <router-link to="/group/" class="col-1 link">Collection</router-link>
        <router-link to="/ingress/" class="col-2 link" data-push-left="off-6" v-if="identity === null">Sign In | Up</router-link>
        <div class="col-2 grid grid-noGutter" data-push-left="off-6" v-if="identity !== null">
          <router-link :to="`/profile/${identity.uid}/`" class="col link">{{ identity.name }}</router-link>
          <div class="col-2"><i class="fa fa-sign-out btn" role="button" @click="onLogout"></i></div>
        </div>
      </div>
    </div></div>
  </div>
  <div id="view"  class="container">
    <transition name="fade">
    <router-view></router-view>
    </transition>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Route } from 'vue-router'
import * as UserSrv from './user-service'
import * as API from './api'

@Component
export default class App extends Vue {
  identity: UserSrv.User | null = UserSrv.identity

  async onLogout() {
    await API.emit<'Success' | 'Error'>('/user/logout', {})
    location.href = '/'
  }
}
</script>

<style lang="less">
#view {
  margin-top: 4rem;
}
</style>
