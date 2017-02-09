<template>
<div id="group" class="grid">
  <div v-for="proitem in proitems" class="col-12"><div class="grid grid-noGutter">
    <div class="col-1">{{ proitem.problem.uid }}</div>
    <router-link :to="`/problem/${proitem.problem.uid}`" class="col">{{ proitem.problem.name }}</router-link>
  </div></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import * as API from './api.ts'

async function getData(route: Route): Promise<[API.ProSet, API.ProItem[]] | null> {
  let proset_uid: number = parseInt(route.params['proset_uid'])
  let proset_result = await API.getProSet(proset_uid)
  if (proset_result === 'Error') {
    return null
  }
  let proset: API.ProSet = proset_result;

  let proitems_result = await API.listProItem(proset)
  if (proitems_result === 'Error') {
    return null
  }
  let proitems: API.ProItem[] = proitems_result

  return [proset, proitems]
}

@Component
export default class Group extends Vue {
  proset: API.ProSet
  proitems: API.ProItem[] = []

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    let result = await getData(to)
    if (result === null) {
      next(false)
    } else {
      let data = result
      next((vm: Group) => {
        [vm.proset, vm.proitems] = data
      })
    }
  }

  async beforeRouteUpdate (to: Route, from: Route, next: Function) {
    let result = await getData(to)
    if (result === null) {
      next(false)
    } else {
      [this.proset, this.proitems] = result
      next()
    }
  }
}
</script>
