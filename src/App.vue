<template>
<div id="app">
  <div id="navbar">
    <div class="container"><div class="grid grid-noBottom">
      <router-link to="/" class="col-2 logo">Sprout OJ</router-link>
      <router-link to="/info" class="col link">消息</router-link>
      <router-link to="/status" class="col link">狀態</router-link>
      <router-link to="/task" class="col link">任務</router-link>
      <router-link to="/ingress" class="col link" data-push-left="off-4">登入 | 註冊</router-link>
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

@Component
export default class App extends Vue {}
</script>
