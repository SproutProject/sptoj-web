<template>
<div id="problem" class="grid" v-if="problem !== null">
  <div class="col-2"><div class="grid-1">
    <div class="col"><div id="title" class="grid">
      <div class="col-2">{{ problem.uid }}.</div>
      <div class="col">{{ problem.name }}</div>
    </div></div>
    <table class="col">
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
    <div class="col grid">
      <input ref="file" type="file" hidden @change="onChangeFile"/>
      <div class="col-12"><select v-model="lang">
        <option :value ="problem.lang">{{ problem.lang }}</option>
      </select></div>
      
      <div class="col-12"><input type="text" readonly placeholder="No selected code" :value="source_file ? source_file.name : ''"/></div>
      <div class="col-6"><button @click="$refs.file.click()">Browse</button></div>
      <div class="col-6"><button @click="onSubmit">Submit</button></div>
    </div>
    <table class="col">
      <thead>
        <tr class="grid">
          <th class="col">Task</th>
          <th class="col">Weight</th>
        </tr>
      </thead>
      <tr v-for="(weight, index) in problem.subtask" class="grid">
        <td class="col">{{ index + 1 }}</td>
        <td class="col">{{ weight }}</td>
      </tr>
    </table>
    <table class="col" v-if="rates !== null">
      <thead>
        <tr class="grid">
          <th class="col">Task</th>
          <th class="col">AC / Score</th>
        </tr>
      </thead>
      <tr v-for="(rate, index) in rates" class="grid">
        <td class="col">{{ index + 1 }}</td>
        <td class="col">{{ rate.count }} / {{ rate.score }}</td>
      </tr>
    </table>
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
  lang: string = ''
  source_file: File | null = null

  @Watch('$route')
  async fetchData() {
    this.problem_uid = parseInt(this.$route.params['problem_uid'])
    let result = await API.getProblem(this.problem_uid)
    if (result !== 'Error') {
      this.problem = result.problem
      if (result.rate !== undefined) {
        this.rates = result.rate
      }
      this.lang = this.problem.lang
    }
  }

  async created() {
    await this.fetchData()
  }

  onChangeFile() {
    let e_file = this.$refs['file'] as HTMLInputElement | undefined
    if (e_file === undefined) {
      this.source_file = null
    } else if (e_file.files === null || e_file.files.length === 0) {
      this.source_file = null
    } else {
      this.source_file = e_file.files[0]
    }
  }

  onContentLoaded() {
    if (this.problem !== null) {
      iFrameResize({})
      let e_content = this.$refs['content'] as any
      e_content.iFrameResizer.sendMessage({
        problem_uid: this.problem.uid,
        revision: this.problem.revision
      })
    }
  }

  async onSubmit() {
    if (this.source_file !== null) {
      let reader = new FileReader()
      if (reader !== null) {
        reader.onload = async () => {
          let code: string = reader.result
          let challenge_uid = await API.submit(this.problem_uid, code, this.lang)
          if (challenge_uid !== 'Error') {
            this.$router.push(`/challenge/${challenge_uid}/`)
          }
        }
        reader.readAsText(this.source_file)
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
