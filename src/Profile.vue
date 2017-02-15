<template>
<div id="profile" class="grid" v-if="identity !== null">
  <div id="menu" class="col-2">
    <ul>
      <li><router-link to="/profile/">Profile</router-link>
      <li v-if="is_admin"><router-link to="/manage/group/">Manage</router-link>
    </ul>
  </div>
  <div class="col">
    {{ identity }}
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as UserSrv from './user-service.ts'

@Component
export default class Profile extends Vue {
  identity: UserSrv.User | null = UserSrv.identity
  
  get is_admin(): boolean {
    if (this.identity === null) {
      return false
    } else {
      return this.identity.level <= UserSrv.UserLevel.kernel
    }
  }
}
</script>
