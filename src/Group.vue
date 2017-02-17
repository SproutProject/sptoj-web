<template>
<div id="group" class="grid">
  <table class="col">
    <thead>
      <tr class="grid">
        <th class="col-1">#</th>
        <th class="col">Name</th>
        <th class="col-2" v-if="statistic !== null">Result</th>
        <th class="col-2">Deadline</th>
      </tr>
    </thead>
    <tr v-for="proitem in proitems" class="grid">
      <td class="col-1">{{ proitem.problem.uid }}</td>
      <td class="col"><router-link :to="`/problem/${proitem.problem.uid}/`">{{ proitem.problem.name }}</router-link></td>
      <td class="col-2" v-if="statistic !== null">{{ getResult(proitem.problem.uid) }}</td>
      <td class="col-2">{{ proitem.deadline ? proitem.deadline : 'None' }}</td>
    </tr>
  </table>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as UserSrv from './user-service'
import * as API from './api'

@Component
export default class Group extends Vue {
  proset: API.ProSet
  proitems: API.ProItem[] = []
  statistic: API.UserStatistic | null = null

  @Watch('$route')
  async fetchData() {
    let proset_uid: number = parseInt(this.$route.params['proset_uid'])
    let [proset, proitems] = await Promise.all([
      API.getProSet(proset_uid),
      API.listProItem(proset_uid),
    ])
    if (proset !== 'Error') {
      this.proset = proset
    }
    if (proitems !== 'Error') {
      this.proitems = proitems
    }
    if (UserSrv.identity !== null) {
      let statistic = await API.getUserStatistic(UserSrv.identity.uid)
      if (statistic !== 'Error') {
        this.statistic = statistic
      }
    }
  }

  async created() {
    await this.fetchData()
  }

  getResult(problem_uid: number): string {
    if (this.statistic === null) {
      return ''
    }
    let item = this.statistic.tried_problems[problem_uid]
    if (item === undefined) { 
      return ''
    }
    return API.getResult(undefined, item.result)
  }
}
</script>
