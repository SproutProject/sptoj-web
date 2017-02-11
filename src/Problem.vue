<template>
<div id="problem" class="grid" v-if="proitem !== null">
  <div class="col-2">
    <div id="title">{{ proitem.problem.uid }} - {{ proitem.problem.name }}</div>
  </div>
  <div class="col">
  </div>
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
