<template>
<div id="task" class="grid">
  <div class="col-2">
    a
  </div>
  <div class="col-2">b</div>
  <div class="col">c</div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Ingress extends Vue {
}
</script>