<template>
<div id="ingress" class="grid">
  <div id="poster" class="col-3" data-push-left="off-2"></div>
  <div class="col-4"><form class="grid-1" @submit.prevent="onSubmit">
    <!-- Login -->
    <form-input class="col" type="email" required v-model="mail">
      <form-label class="col-3">Mail</form-label>
    </form-input>
    <form-input class="col" type="password" required v-model="password">
      <form-label class="col-3">Password</form-label>
    </form-input>
    <!-- Register -->
    <form-input class="col" type="password" required v-if="mode == 'register'" v-model="confirm">
      <form-label class="col-3">Confirm</form-label>
    </form-input>
    <form-input  class="col" type="text" required v-if="mode == 'register'" v-model="name">
      <form-label class="col-3">Name</form-label>
    </form-input>
    <!-- Buttons -->
    <div class="col"><div class="grid">
      <div class="col-3" v-show="mode == 'login'"><button @click.prevent="onSubmit">Login</button></div>
      <div class="col-3"><button @click.prevent="onRegister">Register</button></div>
      <div class="col-3" v-show="mode == 'register'"><button @click.prevent="onCancel">Cancel</button></div>
      <div class="col"><span class="form-message">{{ message }}</span></div>
    </div></div>
  </form></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class Ingress extends Vue {
  mode: string = 'login'
  message: string = ''
  mail: string = ''
  password: string = ''
  confirm: string = ''
  name: string = ''

  async onSubmit() {
    if (this.mode == 'login') {
      let result = await API.emit<'Success' | 'Eexist'>('/user/login', {
        mail: this.mail,
        password: this.password,
      })
      switch (result) {
        case 'Success':
          location.href = '/'
          break
        default:
          this.message = 'Incorrect mail or password'
          break
      }
    } else if (this.mode == 'register') {
      if (this.password != this.confirm) {
        this.message = '兩次密碼不相同'
        return
      }
      let result = await API.emit<'Success' | 'Eexist'>('/user/register', {
        mail: this.mail,
        password: this.password,
        name: this.name,
      })
      switch (result) {
        case 'Success':
          await API.emit<'Success' | 'Eexist'>('/user/login', {
            mail: this.mail,
            password: this.password,
          })
          location.href = '/'
          break
        case 'Eexist':
          this.message = '信箱已被註冊'
          break
      }
    }
  }

  onRegister() {
    if (this.mode == 'login') {
      this.mode = 'register';
    } else if (this.mode == 'register') {
      this.onSubmit();
    }
  }

  onCancel() {
    this.mode = 'login';
  }
}
</script>

<style lang="less">
#poster {
  padding-left: 0;
}
</style>
