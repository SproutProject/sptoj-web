<template>
<div id="manage" class="grid">
  <div id="menu" class="col-2">
    <ul>
      <li><router-link to="/manage/overview/">Overview</router-link>
      <li><router-link to="/manage/group/">Collections</router-link>
      <li><router-link to="/manage/problem/">Problems</router-link>
      <li><router-link to="/manage/user/">Users</router-link>
    </ul>
  </div>
  <div class="col">
    <router-view></router-view>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
@Component
export default class Manage extends Vue {}
</script>
