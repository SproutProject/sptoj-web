<template>
<div id="challenge" class="grid" v-if="challenge !== null">
  <div class="col-4">
    <table>
      <tr class="grid">
        <td class="col-4">Challenge</td>
        <td class="col"><router-link :to="`/challenge/${challenge.uid}/`">{{ challenge.uid }}</router-link></td>
      </tr>
      <tr class="grid">
        <td class="col-4">Problem</td>
        <td class="col"><router-link :to="`/problem/${challenge.problem.uid}/`">{{ challenge.problem.uid }}</router-link></td>
      </tr>
      <tr class="grid">
        <td class="col-4">Submitter</td>
        <td class="col"><router-link :to="`/profile/${challenge.submitter.uid}/`">{{ challenge.submitter.name }}</router-link></td>
      </tr>
      <tr class="grid">
        <td class="col-4">Timestamp</td>
        <td class="col">{{ challenge.timestamp }}</td>
      </tr>
      <tr class="grid">
        <td class="col-4">Total Runtime</td>
        <td class="col">{{ challenge.metadata['runtime'] }}</td>
      </tr>
      <tr class="grid">
        <td class="col-4">Total Memory</td>
        <td class="col">{{ challenge.metadata['memory'] }}</td>
      </tr>
      <tr class="grid">
        <td class="col-4">Result</td>
        <td class="col">{{ getResult(challenge.state, challenge.metadata['result']) }}</td>
      </tr>
    </table>
  </div>
  <div class="col">
    <table>
      <tr class="grid">
        <th class="col">Test</th>
        <th class="col">Result</th>
        <th class="col">Runtime (ms)</th>
        <th class="col">Memory (KB)</th>
      </tr>
      <tr v-for="subtask in challenge.subtasks" class="grid">
        <td class="col">{{ subtask.index + 1 }}</td>
        <td class="col">{{ getResult(subtask.state, subtask.metadata['result']) }}</td>
        <td class="col">{{ subtask.metadata['runtime'] }}</td>
        <td class="col">{{ subtask.metadata['memory'] }}</td>
      </tr>
    </table>
  </div>
  <div class="col-12">
    <code>{{ challenge.metadata['verdict'] }}</code>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class Challenge extends Vue {
  challenge: API.Challenge | null = null
  
  @Watch('$route')
  async fetchData() {
    let challenge_uid = parseInt(this.$route.params['challenge_uid'])
    let challenge = await API.getChallenge(challenge_uid)
    if (challenge !== 'Error') {
      this.challenge = challenge
    }
  }

  async created() {
    await this.fetchData()
  }

  getResult(state: API.JudgeState, result: number): string {
    return API.getResult(state, result)
  }
}
</script>
