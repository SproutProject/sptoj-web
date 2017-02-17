<template>
<div id="user-setting" class="grid">
  <div class="col-4">
    <div class="grid"><h2 class="col">Change Information</h2></div>
    <div class="grid"><form class="col">
      <div class="grid"><form-input class="col" type="text" required v-model="name">
        <form-label class="col-3">Name</form-label>
      </form-input></div>
      <div class="grid">
        <div class="col-3"><button @click.prevent="onApplyInfo">Apply</button></div>
      </div>
    </form></div>
    <div class="grid"><h2 class="col">Change Password</h2></div>
    <div class="grid"><form class="col">
      <div class="grid"><form-input class="col" type="password" required v-model="password">
        <form-label class="col-3">Password</form-label>
      </form-input></div>
      <div class="grid"><form-input class="col" type="password" required v-model="confirm">
        <form-label class="col-3">Confirm</form-label>
      </form-input></div>
      <div class="grid">
        <div class="col-3"><button @click.prevent="onApplyPassword">Apply</button></div>
      </div>
    </form></div>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class UserSetting extends Vue {
  name: string = ''
  password: string = ''
  confirm: string = ''

  @Prop
  profile: API.Profile

  @Watch('$route')
  async fetchData() {
    this.name = this.profile.name
  }

  async created() {
    await this.fetchData()
  }

  async onApplyInfo() {
    await API.setUser({ uid: this.profile.uid, name: this.name })
  }

  async onApplyPassword() {
    if (this.password === this.confirm) {
      await API.setUser({ uid: this.profile.uid, name: this.name, password: this.password })
    }
  }
}
</script>
