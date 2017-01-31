<template>
<div id="ingress" class="grid">
  <img id="poster" class="col-3" data-push-left="off-2">
  <div class="col-4"><form class="grid-1" @submit.prevent="onSubmit">
    <!-- Login -->
    <form-input class="col" type="email" required>
      <label class="col-3">信箱</label>
    </form-input>
    <form-input class="col" type="password" required>
      <label class="col-3">密碼</label>
    </form-input>
    <!-- Register -->
    <form-input  class="col" type="password" required v-if="mode == 'register'">
      <label class="col-3">確認密碼</label>
    </form-input>
    <!-- Buttons -->
    <div class="col"><div class="grid grid-noGutter">
      <button class="col-3" v-show="mode == 'login'" @click.prevent="onSubmit">登入</button>
      <button class="col-3" @click.prevent="onRegister">註冊</button>
      <button class="col-3" v-show="mode == 'register'" @click.prevent="onCancel">取消</button>
    </div></div>
  </form></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Ingress extends Vue {
  mode: string = 'login'

  onSubmit() {
    console.log('test');
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