<template>
<div id="group" class="grid">
  <div v-for="proitem in proitems" class="col-12"><div class="grid grid-noGutter">
    <div class="col-1">{{ proitem.problem.uid }}</div>
    <router-link :to="`/problem/${proset.uid}/${proitem.uid}`" class="col">{{ proitem.problem.name }}</router-link>
  </div></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import * as API from './api.ts'

@Component
export default class Group extends Vue {
  proset: API.ProSet
  proitems: API.ProItem[] = []

  @Watch('$route')
  async fetchData() {
    let proset_uid: number = parseInt(this.$route.params['proset_uid'])
    let [proset_result, proitems_result] = await Promise.all([
      API.getProSet(proset_uid),
      API.listProItem(proset_uid),
    ])
    if (proset_result !== 'Error') {
      this.proset = proset_result;
    }
    if (proitems_result !== 'Error') {
      this.proitems = proitems_result
    }
  }

  async created() {
    await this.fetchData()
  }
}
</script>
