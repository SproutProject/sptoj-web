<template>
<div id="profile" class="grid">
<div id="menu" class="col-2">
  <div class="name">{{ name }}</div>
  <ul>
    <li><router-link to="/profile">個人</router-link>
    <li v-if="admin"><router-link to="/manage">管理</router-link>
  </ul>
</div>
<div class="col">
  B
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as UserSrv from './user-service.ts'

@Component
export default class Profile extends Vue {
  identity: string = UserSrv.identity.name
  admin: boolean = UserSrv.identity.level == UserSrv.UserLevel.kernel
}

</script>

<style lang="less">
#menu {
  
}
</style>