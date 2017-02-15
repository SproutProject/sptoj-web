<template>
<div id="group" class="grid">
  <div class="col"><table>
    <tr class="grid">
      <th class="col-1">ID</th>
      <th class="col">Name</th>
      <th class="col-2">Deadline</th>
    </tr>
    <tr v-for="proitem in proitems" class="grid">
      <td class="col-1">{{ proitem.problem.uid }}</td>
      <td class="col"><router-link :to="`/problem/${proitem.problem.uid}/`">{{ proitem.problem.name }}</router-link></td>
      <td class="col-2">{{ proitem.deadline ? proitem.deadline : 'None' }}</td>
    </tr>
  </table></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
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
