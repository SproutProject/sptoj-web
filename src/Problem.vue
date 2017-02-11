<template>
<div id="problem" class="grid" v-if="proitem !== null">
  <div class="col-2"><div class="grid">
    <div id="title" class="col-12">{{ proitem.problem.uid }} - {{ proitem.problem.name }}</div>
    <div class="col-12"><button>Submit</button></div>
    <div id="information" class="col-12">
      <div class="grid">
        <div class="col">Languages</div>
        <div class="col">{{ proitem.problem.lang }}</div>
      </div>
      <div class="grid">
        <div class="col">Timelimit</div>
        <div class="col">{{ proitem.problem.timelimit }}</div>
      </div>
      <div class="grid">
        <div class="col">Memlimit</div>
        <div class="col">{{ proitem.problem.memlimit }}</div>
      </div>
    </div>
    <div id="subtask" class="col-12">
      <div class="grid head">
        <div class="col">Subtask</div>
        <div class="col">Ratio</div>
      </div>
      <div v-for="(ratio, index) in proitem.problem.subtask" class="grid">
        <div class="col">{{ index + 1 }}</div>
        <div class="col">{{ ratio }}</div>
      </div>
    </div>
  </div></div>
  <iframe class="col" id="content" :src="`/api/proset/${$route.params.proset_uid}/${$route.params.proset_uid}/static/`"/>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api.ts'


@Component
export default class ViewProblem extends Vue {
  proitem: API.ProItem | null = null

  @Watch('$route')
  async fetchData() {
    let proset_uid: number = parseInt(this.$route.params['proset_uid'])
    let proitem_uid: number = parseInt(this.$route.params['proitem_uid'])
    let result = await API.getProItem(proset_uid, proitem_uid)
    if (result !== 'Error') {
      this.proitem = result
    }
  }

  async created() {
    await this.fetchData()
  }
}
</script>
