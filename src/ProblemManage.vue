<template>
<div id="problem-manage" class="grid">
  <button @click="onUpdateProblem">更新題目</button>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as API from './api.ts'

@Component
export default class ProblemManage extends Vue {
  async onUpdateProblem() {
    await API.updateProblem()
  }
}
</script>
