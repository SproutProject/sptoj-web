<template>
<div id="problem" class="grid" v-if="problem !== null">
  <div class="col-2"><div class="grid">
    <div id="title" class="col-12"><div class="grid">
      <div class="col-1">{{ problem.uid }}.</div>
      <div class="col">{{ problem.name }}</div>
    </div></div>
    <div id="information" class="col-12">
      <table>
        <tr class="grid">
          <th class="col">Param</th>
          <th class="col">Value</th>
        </tr>
        <tr class="grid">
          <td class="col">Language</td>
          <td class="col">{{ problem.lang }}</td>
        </tr>
        <tr class="grid">
          <td class="col">Timelimit</td>
          <td class="col">{{ problem.timelimit }}</td>
        </tr>
        <tr class="grid">
          <td class="col">Memlimit</td>
          <td class="col">{{ problem.memlimit }}</td>
        </tr>
      </table>
    </div>
    <div class="col-12"><div class="grid">
      <div class="col-12"><input ref="file" type="file"/></div>
      <div class="col-6"><button disabled>Editor</button></div>
      <div class="col-6"><button @click="onSubmit">Submit</button></div>
    </div></div>
    <div id="subtask" class="col-12">
      <table>
        <tr class="grid">
          <th class="col">Task</th>
          <th class="col">Weight</th>
        </tr>
        <tr v-for="(weight, index) in problem.subtask" class="grid">
          <td class="col">{{ index + 1 }}</td>
          <td class="col">{{ weight }}</td>
        </tr>
      </table>
    </div>
    <div id="rate" class="col-12" v-if="rates !== null">
      <table>
        <tr class="grid">
          <th class="col">Task</th>
          <th class="col">AC / Score</th>
        </tr>
        <tr v-for="(rate, index) in rates" class="grid">
          <td class="col">{{ index + 1 }}</td>
          <td class="col">{{ rate.count }} / {{ rate.score }}</td>
        </tr>
      </table>
    </div>
  </div></div>
  <div class="col">
    <iframe id="content" ref="content" :src="require('./assets/viewer.html')" scrolling="no" @load="onContentLoaded"></iframe>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api'

declare function iFrameResize(options: any): any

@Component
export default class Problem extends Vue {
  problem_uid: number
  problem: API.Problem | null = null
  rates: API.ProblemRate[] | null = null

  @Watch('$route')
  async fetchData() {
    this.problem_uid = parseInt(this.$route.params['problem_uid'])
    let result = await API.getProblem(this.problem_uid)
    if (result !== 'Error') {
      this.problem = result.problem
      if (result.rate !== undefined) {
        this.rates = result.rate
      }
    }
  }

  async created() {
    await this.fetchData()
  }

  async onContentLoaded() {
    iFrameResize({})
    let e_content = this.$refs['content'] as any
    e_content.iFrameResizer.sendMessage(this.problem_uid)
  }

  async onSubmit() {
    let e_file = this.$refs['file'] as HTMLInputElement
    if (e_file.files !== null) {
      let file = e_file.files[0]
      let reader = new FileReader()
      if (file !== null && reader !== null) {
        reader.onload = async () => {
          let code: string = reader.result
          let lang: string = 'g++'
          let challenge_uid = await API.submit(this.problem_uid, code, lang)
          if (challenge_uid !== 'Error') {
            this.$router.push(`/challenge/${challenge_uid}/`)
          }
        }
        reader.readAsText(file)
      }
    }
  }
}
</script>

<style lang="less">
#title {
  > div {
    height: 2rem;
    line-height: 2rem;
    font-size: 1.2rem;
  }
}
#content {
  width: 100%;
}
</style>
