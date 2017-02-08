<template>
<div id="group-board">
a
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Route, RawLocation } from 'vue-router'
import { Component } from 'vue-property-decorator'
import * as API from './api.ts'

@Component
export default class GroupBoard extends Vue {
  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    let result = await API.emit<'Error' | [API.ProSet]>('/proset/list', {});
    next()
  }
}
</script>
