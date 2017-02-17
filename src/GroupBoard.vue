<template>
<div id="group-board" class="grid" v-if="groups !== null">
  <ul class="col-2">
    <li v-for="group in groups"><router-link :to="`/group/${group.uid}/`">{{ group.name }}</router-link></li>
  </ul>
  <div class="col"><router-view></router-view></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class GroupBoard extends Vue {
  groups: API.ProSet[] | null = []

  async created() {
    let groups = await API.listProSet()
    if (groups !== 'Error') {
      this.groups = groups
    }
  }
}
</script>
