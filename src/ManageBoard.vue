<template>
<div id="manage" class="grid">
  <ul class="col-2">
    <li><router-link to="/manage/group/">Collections</router-link>
    <li><router-link to="/manage/problem/">Problems</router-link>
    <li><router-link to="/manage/user/">Users</router-link>
  </ul>
  <div class="col">
    <transition name="fade">
    <router-view></router-view>
    </transition>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class ManageBoard extends Vue {}
</script>
