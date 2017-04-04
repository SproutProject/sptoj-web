<template>
<div id="group" class="grid" v-if="proset !== null">
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
  proset: API.ProSet | null = null
  proitems: API.ProItem[] | null = null
  statistic: API.UserStatistic | null = null

  @Watch('$route')
  async fetchData() {
    this.proset = null
    this.proitems = null
    this.statistic = null

    let proset_uid: number = parseInt(this.$route.params['proset_uid'])
    let proset: API.ProSet | 'Error'
    let proitems: API.ProItem[] | 'Error'
    let statistic: API.UserStatistic | 'Error' | null = null
    if (UserSrv.identity === null) {
      [proset, proitems] = await Promise.all([
        API.getProSet(proset_uid),
        API.listProItem(proset_uid),
      ])
    } else {
      [proset, proitems, statistic] = await Promise.all([
        API.getProSet(proset_uid),
        API.listProItem(proset_uid),
        API.getUserStatistic(UserSrv.identity.uid),
      ])
    }

    if (proset !== 'Error') {
      this.proset = proset
    }
    if (proitems !== 'Error') {
      this.proitems = proitems
    }
    if (statistic !== null && statistic !== 'Error') {
      this.statistic = statistic
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
    return API.getResult(API.JudgeState.done, item.result)
  }
}
</script>
