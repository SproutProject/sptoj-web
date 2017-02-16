<template>
<div id="problem-manage" class="grid" v-if="items != null">
  <div class="col-12"><div class="grid">
    <div class="col-1">
      <input type="text" placeholder="ID" v-model="add_problem_id"/>
    </div>
    <div class="col">
      <input type="text" placeholder="Git Repository" v-model="add_problem_git"/>
    </div>
    <div class="col-1"><button @click="onAddProblem">Add</button></div>
  </div></div>
  <div class="col-12"><table>
    <tr class="grid">
      <th class="col-1">#</th>
      <th class="col-2">Name</th>
      <th class="col">Revision</th>
      <th class="col">Git Repository</th>
      <th class="col-1"></th>
    </tr>
    <tr v-for="item in items" class="grid">
      <td class="col-1">{{ item.problem.uid }}</td>
      <td class="col-2">{{ item.problem.name }}</td>
      <td class="col">
        <input type="text" readonly :value="item.problem.revision"/>
      </td>
      <td class="col">
        <input type="text" placeholder="Git Repository" v-model="item.git"/>
      </td>
       <td class="col-1"><div class="grid grid-noGutter">
        <div class="col"><i class="fa fa-upload btn" role="button" @click="onUpdateProblem(item)"></i></div>
        <div class="col"><i class="fa fa-trash-o btn" role="button" @click="onRemoveProblem(item)"></i></div>
      </div></td>
    </tr>
  </table></div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'
import * as API from './api'

type Item = { problem: API.Problem, git: string }

@Component
export default class ProblemManage extends Vue {
  items: Item[] | null = null
  add_problem_id: string = ''
  add_problem_git: string = ''

  async fetchData() {
    let items = await API.listProblem()
    if (items !== 'Error') {
      this.items = items
    }
  }

  async created() {
    await this.fetchData()
  }

  async onAddProblem() {
    if (await API.updateProblem(parseInt(this.add_problem_id), this.add_problem_git) === 'Success') {
      await this.fetchData()
    }
  }

  async onUpdateProblem(item: Item) {
    if (await API.updateProblem(item.problem.uid, item.git) === 'Success') {
      await this.fetchData()
    }
  }

  async onRemoveProblem(item: Item) {
    if (this.items !== null) {
      if (await API.removeProblem(item.problem.uid) === 'Success') {
        let index = this.items.indexOf(item)
        this.items.splice(index, 1)
      }
    }
  }
}
</script>
