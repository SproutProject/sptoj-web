<template>
<div id="app">
  <div id="navbar">
    <div class="container"><div class="grid grid-noBottom">
      <router-link to="/" class="col-2 logo">Sprout OJ</router-link>
      <router-link to="/info/" class="col-1 link">Information</router-link>
      <router-link to="/rank/" class="col-1 link">Ranking</router-link>
      <router-link to="/status/" class="col-1 link">Status</router-link>
      <router-link to="/group/" class="col-1 link">Collection</router-link>
      <router-link to="/ingress/" class="col link" data-push-left="off-4" v-if="identity === null">Sign In | Up</router-link>
      <router-link to="/profile/" class="col link" data-push-left="off-4" v-if="identity !== null">{{ identity.name }}</router-link>
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
import * as UserSrv from './user-service'

@Component
export default class App extends Vue {
  identity: UserSrv.User | null = UserSrv.identity
}
</script>
