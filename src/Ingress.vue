<template>
<div id="ingress" class="grid">
  <img id="poster" class="col-3" data-push-left="off-2">
  <div class="col-4"><form class="grid-1" @submit.prevent="onSubmit">
    <!-- Login -->
    <form-input class="col" type="email" required v-model="mail">
      <label class="col-3">信箱</label>
    </form-input>
    <form-input class="col" type="password" required v-model="password">
      <label class="col-3">密碼</label>
    </form-input>
    <!-- Register -->
    <form-input  class="col" type="password" required v-if="mode == 'register'" v-model="confirm">
      <label class="col-3">確認密碼</label>
    </form-input>
    <form-input  class="col" type="text" required v-if="mode == 'register'" v-model="name">
      <label class="col-3">名稱</label>
    </form-input>
    <!-- Buttons -->
    <div class="col"><div class="grid grid-noGutter">
      <button class="col-3" v-show="mode == 'login'" @click.prevent="onSubmit">登入</button>
      <button class="col-3" @click.prevent="onRegister">註冊</button>
      <button class="col-3" v-show="mode == 'register'" @click.prevent="onCancel">取消</button>
      <span class="col form-message">{{ message }}</span>
    </div></div>
  </form></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as API from './API.ts'

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
          this.message = '信箱或密碼錯誤'
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