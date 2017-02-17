<template>
<div id="status" class="grid" v-if="challenges !== null">
  <div class="col-2"></div>
  <div class="col">
    <table>
      <tr class="grid">
        <th class="col-1">#</th>
        <th class="col">Submitter</th>
        <th class="col">Problem</th>
        <th class="col-2">Result</th>
        <th class="col-1">Runtime</th>
        <th class="col-1">Memory</th>
        <th class="col-2">Timestamp</th>
      </tr>
      <tr v-for="challenge in challenges" class="grid">
        <template v-if="challenge === null">
          <td class="col" colspan=7><div class="forbidden"></div></td>
        </template>
        <template v-if="challenge !== null">
          <td class="col-1"><router-link :to="`/challenge/${challenge.uid}/`">{{ challenge.uid }}</router-link></td>
          <td class="col"><router-link :to="`/profile/${challenge.submitter.uid}/`">{{ challenge.submitter.name }}</router-link></td>
          <td class="col"><router-link :to="`/problem/${challenge.problem.uid}/`">{{ challenge.problem.name }}</router-link></td>
          <td class="col-2">{{ getResult(challenge.state, challenge.metadata['result']) }}</td>
          <td class="col-1">{{ challenge.metadata['runtime'] }}</td>
          <td class="col-1">{{ challenge.metadata['memory'] }}</td>
          <td class="col-2">{{ challenge.timestamp }}</td>
        </template>
      </tr>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class ChallengeBoard extends Vue {
  challenges: (API.Challenge | null)[] | null = null

  async created() {
    let challenges = await API.listChallenge()
    if (challenges !== 'Error') {
      this.challenges = challenges
    }
  }

  getResult(state: API.JudgeState, result: number): string {
    return API.getResult(state, result)
  }
}
</script>

<style lang="less">
div.forbidden {
  height: 1.4rem;
  margin: 0.3rem 0;
  background-image: repeating-linear-gradient(-45deg, transparent, transparent 0.6rem, gray 0.6rem, gray 1rem);
}
</style>
