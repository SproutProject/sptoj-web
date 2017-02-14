<template>
<div id="problem" class="grid" v-if="proitem !== null">
  <div class="col-2"><div class="grid">
    <div id="title" class="col-12"><div class="grid">
      <div class="col-1">{{ proitem.problem.uid }}.</div>
      <div class="col">{{ proitem.problem.name }}</div>
    </div></div>
    <div id="information" class="col-12">
      <table>
        <tr class="grid">
          <th class="col">Param</th>
          <th class="col">Value</th>
        </tr>
        <tr class="grid">
          <td class="col">Language</td>
          <td class="col">{{ proitem.problem.lang }}</td>
        </tr>
        <tr class="grid">
          <td class="col">Timelimit</td>
          <td class="col">{{ proitem.problem.timelimit }}</td>
        </tr>
        <tr class="grid">
          <td class="col">Memlimit</td>
          <td class="col">{{ proitem.problem.memlimit }}</td>
        </tr>
      </table>
    </div>
    <div id="subtask" class="col-12">
      <table>
        <tr class="grid">
          <th class="col">Subtask</th>
          <th class="col">Weight</th>
        </tr>
        <tr v-for="(weight, index) in proitem.problem.subtask" class="grid">
          <td class="col">{{ index + 1 }}</td>
          <td class="col">{{ weight }}</td>
        </tr>
      </table>
    </div>
    <div class="col-12"><div class="grid">
      <div class="col-12"><input ref="file" type="file"/></div>
      <div class="col-6"><button disabled>Editor</button></div>
      <div class="col-6"><button @click="onSubmit">Submit</button></div>
    </div></div>
  </div></div>
  <div class="col">
    <iframe id="content" :src="`/api/proset/${proset_uid}/${proitem_uid}/static/`" scrolling="no" @load="resizeContent"/>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api.ts'

declare function iFrameResize(options: any): any

@Component
export default class Problem extends Vue {
  proset_uid: number
  proitem_uid: number
  proitem: API.ProItem | null = null

  resizeContent() {
    iFrameResize({})
  }

  @Watch('$route')
  async fetchData() {
    this.proset_uid = parseInt(this.$route.params['proset_uid'])
    this.proitem_uid = parseInt(this.$route.params['proitem_uid'])
    let result = await API.getProItem(this.proset_uid, this.proitem_uid)
    if (result !== 'Error') {
      this.proitem = result
    }
  }

  async created() {
    await this.fetchData()
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
          let challenge_uid = await API.submit(this.proset_uid, this.proitem_uid, code, lang)
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
