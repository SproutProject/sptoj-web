<template>
<div class="grid">
  <div class="col grid rankview">
    <table class="col-2 ranker">
      <thead>
        <tr class="grid">
          <th class="col">Ranker</th>
          <th class="col">Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr class="grid" v-for="ranker in rankers">
          <td class="col"><router-link :to="`/profile/${ranker.profile.uid}/`">{{ ranker.profile.name }}</router-link></td>
          <td class="col">{{ ranker.rate }}</td>
        </tr>
      </tbody>
    </table>
    <div class="col board">
      <table :style="{ width: proitems.length * 60 + 'px' }">
        <thead>
          <tr>
            <th v-for="proitem in proitems"><router-link :to="`/problem/${proitem.problem.uid}/`">{{ proitem.problem.uid }}</router-link></th>
          </tr>
        </thead>
        <tr v-for="ranker in rankers">
          <td v-for="proitem in proitems">{{ getResult(ranker.results[proitem.problem.uid])  }}</td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'
import * as API from '../api'

@Component
export default class RankView extends Vue {
  @Prop
  proitems: API.ProItem[]

  @Prop
  rankers: API.Ranker[]

  getResult(result: number | undefined): string {
    if (result === undefined) {
      return ''
    } else {
      return API.getResult(API.JudgeState.done, result, true)
    }
  }
}
</script>

<style lang="less">
div.rankview {
  table.ranker {
    padding-bottom: 1.5rem !important;

    th:last-child, td:last-child {
      border-right: solid 1px darkgray;
    }
  }

  div.board {
    width: 100%;
    height: 100%;
    padding: 0 0;
    overflow-x: auto;

    > table {
      position: absolute;

      th, td {
        width: 60px;
        text-align: center;
      }
    }
  }
}
</style>
