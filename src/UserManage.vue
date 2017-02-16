<template>
<div id="user-manage" class="grid" v-if="users !== null">
  <table>
    <tr class="grid">
      <th class="col-1">#</th>
      <th class="col">Mail</th>
      <th class="col">Name</th>
      <th class="col-2">Level</th>
      <th class="col-2">Category</th>
      <th class="col-1"></th>
    </tr>
    <tr v-for="user in users" class="grid">
      <td class="col-1">{{ user.uid }}</td>
      <td class="col">{{ user.mail }}</td>
      <td class="col"><router-link :to="`/profile/${user.uid}/`">{{ user.name }}</router-link></td>
      <td class="col-2">
        <select v-model="user.level">
          <option :value="0">Kernel</option>
          <option :value="3">User</option>
        </select>
      </td>
      <td class="col-2">
        <select v-model="user.category">
          <option :value="0">Universe</option>
          <option :value="1">Algo</option>
          <option :value="2">CLang</option>
          <option :value="3">PyLang</option>
        </select>
      </td>
      <td class="col-1"><div class="grid grid-noGutter">
        <div class="col"><i class="fa fa-floppy-o btn" role="button" @click="onApplyUser(user)"></i></div>
        <div class="col"><i class="fa fa-trash-o btn" role="button" @click="onRemoveUser(user)"></i></div>
      </div></td>
    </tr>
  </table>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as UserSrv from './user-service'
import * as API from './api'

@Component
export default class UserManage extends Vue {
  users: UserSrv.User[] | null = null

  async created() {
    let users = await API.listUser()
    if (users !== 'Error') {
      this.users = users
    }
  }

  async onApplyUser(user: UserSrv.User) {
    if (await API.setUser(user) === 'Error') {} 
  }

  async onRemoveUser(user: UserSrv.User) {
    if (this.users !== null) {
      if (await API.removeUser(user.uid) === 'Success') {
        let index = this.users.indexOf(user)
        this.users.splice(index, 1)
      }
    }
  }
}
</script>
