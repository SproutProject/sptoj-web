<template>
<div id="user-profile" class="grid">
  <div class="col-4">
    <div class="grid"><h2 class="col">Tried Problems</h2></div>
    <div class="grid"><table class="col">
      <thead>
        <tr class="grid">
          <th class="col">#</th>
          <th class="col">Result</th>
        </tr>
      </thead>
      <tr v-for="item in tried_problems" class="grid">
        <td class="col"><router-link :to="`/problem/${item.uid}/`">{{ item.uid }}</router-link></td>
        <td class="col">{{ item.result }}</td>
      </tr>
    </table></div>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class UserProfile extends Vue {
  tried_problems: { uid: number, result: string }[] = []

  @Prop
  profile: API.Profile

  @Watch('$route')
  async fetchData() {
    let statistic = await  API.getUserStatistic(this.profile.uid)
    if (statistic !== 'Error') {
      let tried_problems = statistic.tried_problems
      this.tried_problems = Object.keys(tried_problems).map((key: string) => {
        return { uid: parseInt(key), result: API.getResult(undefined, tried_problems[key].result) }
      })
    }
  }

  async created() {
    await this.fetchData()
  }
}
</script>
