<template>
<div id="group-board" class="grid">
  <div class="col-12" v-for="group in groups">{{ group.name }}</div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Route, RawLocation } from 'vue-router'
import { Component } from 'vue-property-decorator'
import * as API from './api.ts'

@Component
export default class GroupBoard extends Vue {
  groups: API.ProSet[] = []

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    let result = await API.emit<'Error' | API.ProSet[]>('/proset/list', {})
    if (result !== 'Error') {
      let groups = result;
      next((vm: GroupBoard) => { vm.groups = groups })
    }
  }
}
</script>
