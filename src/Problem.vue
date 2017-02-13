<template>
<div id="problem" class="grid" v-if="proitem !== null">
  <div class="col-2"><div class="grid">
    <div id="title" class="col-12">{{ proitem.problem.uid }} - {{ proitem.problem.name }}</div>
    <div class="col-12">
      <button @click="onSubmit">Submit</button>
      <input ref="file" type="file" hidden="hidden" @change="onSelectedFile"/>
    </div>
    <div id="information" class="col-12">
      <div class="grid">
        <div class="col">Languages</div>
        <div class="col">{{ proitem.problem.lang }}</div>
      </div>
      <div class="grid">
        <div class="col">Timelimit</div>
        <div class="col">{{ proitem.problem.timelimit }}</div>
      </div>
      <div class="grid">
        <div class="col">Memlimit</div>
        <div class="col">{{ proitem.problem.memlimit }}</div>
      </div>
    </div>
    <div id="subtask" class="col-12">
      <div class="grid head">
        <div class="col">Subtask</div>
        <div class="col">Ratio</div>
      </div>
      <div v-for="(ratio, index) in proitem.problem.subtask" class="grid">
        <div class="col">{{ index + 1 }}</div>
        <div class="col">{{ ratio }}</div>
      </div>
    </div>
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
export default class ViewProblem extends Vue {
  proset_uid: number
  proitem_uid: number
  proitem: API.ProItem | null = null

  resizeContent() {
    iFrameResize({ log: true })
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
    e_file.click();
  }

  async onSelectedFile() {
    let e_file = this.$refs['file'] as HTMLInputElement
    if (e_file.files !== null) {
      let file = e_file.files[0]
      let reader = new FileReader()
      if (file !== null && reader !== null) {
        reader.onload = async () => {
          let code: string = reader.result
          let lang: string = 'c++'
          await API.submit(this.proset_uid, this.proitem_uid, code, lang)
        }
        reader.readAsText(file)
      }
    }
  }
}
</script>

<style lang="less">
#content {
  width: 100%;
}
</style>
