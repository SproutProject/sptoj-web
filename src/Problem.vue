<template>
<div id="problem" class="grid" v-if="problem !== null">
  <div class="col-2">
    <div class="grid">
      <div class="col">
        <div id="title">No. {{ problem.uid }}</div>
      </div>
    </div>
    <input ref="file" type="file" hidden @change="onChangeFile"/>
    <div class="grid"><div class="col"><select v-model="lang">
      <option :value ="problem.lang">{{ problem.lang }}</option>
    </select></div></div>
    <div class="grid">
      <div class="col-3"><button @click="$refs.file.click()"><i class="fa fa-file-code-o" aria-hidden="true"></i></button></div>
      <div class="col"><input type="text" readonly placeholder="No selected file" :value="source_file ? source_file.name : ''" @click="$refs.file.click()"/></div>
    </div>
    <div class="grid">
      <div class="col-6"><button @click="onSubmit">Submit</button></div>
      <div class="col-6"><button @click="onToggleEditor">Editor</button></div>
    </div>
    <table>
      <thead>
        <tr class="grid">
          <th class="col">Attribute</th>
          <th class="col">Value</th>
        </tr>
      </thead>
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
    <table>
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
    <table v-if="rates !== null">
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
    <div class="grid-noGutter">
      <div class="col-6" data-push-left="off-6"><select v-model="rate_category" @change="fetchRate">
        <option :value="0">&#x21b3; Universe</option>
        <option :value="1">&#x21b3; Algo</option>
        <option :value="2">&#x21b3; CLang</option>
        <option :value="3">&#x21b3; PyLang</option>
      </select></div>
    </div>
  </div>
  <div class="col">
    <div id="split-line" v-show="show_editor"></div>
    <div id="editor-box" v-show="show_editor">
      <div id="editor" style="font-size: 1.2rem;"></div>
    </div>
    <div id="content-box" :class="{ split: show_editor }">
      <iframe id="content" ref="content" :src="require('./assets/viewer.html')" scrolling="no" @load="onContentLoaded"></iframe>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api'
import * as UserSrv from './user-service'

declare var ace: any
declare function iFrameResize(options: any): any

@Component
export default class Problem extends Vue {
  show_editor: boolean = false;
  identity: UserSrv.User | null = UserSrv.identity
  problem_uid: number
  problem: API.Problem | null = null
  rate_category: UserSrv.UserCategory
  rates: API.ProblemRate[] | null = null
  lang: string = ''
  source_file: File | null = null
  code: string | null = null
  editor: any

  @Watch('$route')
  async fetchData() {
    this.problem_uid = parseInt(this.$route.params['problem_uid'])
    let result = await API.getProblem(this.problem_uid)
    if (result !== 'Error') {
      this.problem = result
      this.lang = this.problem.lang

      if (this.identity !== null) {
        this.rate_category = this.identity.category
      } else {
        this.rate_category = UserSrv.UserCategory.universe
      }
      await this.fetchRate()
    }
  }

  async fetchRate() {
    let result = await API.getProblemRate(this.problem_uid, this.rate_category)
    if (result === 'Error') {
      this.rates = []
    } else {
      this.rates = result
    }
  }

  async created() {
    await this.fetchData()

    this.editor = ace.edit("editor")
    this.editor.setTheme("ace/theme/monokai")
    switch (this.lang) {
      case 'g++':
      case 'makefile':
        this.editor.getSession().setMode("ace/mode/c_cpp")
        break
      case 'python3':
        this.editor.getSession().setMode("ace/mode/python")
        break
    }
    this.editor.getSession().on('change', () => {
      this.code = this.editor.getValue()
    })
  }

  onToggleEditor() {
    this.show_editor = !this.show_editor;
    if (this.show_editor && this.code !== null) {
      this.editor.setValue(this.code)
    }
  }

  onChangeFile() {
    let e_file = this.$refs['file'] as HTMLInputElement | undefined
    if (e_file === undefined) {
      this.source_file = null
    } else if (e_file.files === null || e_file.files.length === 0) {
      this.source_file = null
    } else {
      this.source_file = e_file.files[0]
      let reader = new FileReader()
      reader.onload = async () => {
        this.code = reader.result
        this.editor.setValue(this.code)
      }
      reader.readAsText(this.source_file)
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
    if (this.code !== null) {
      let challenge_uid = await API.submit(this.problem_uid, this.code, this.lang)
      if (challenge_uid !== 'Error') {
        this.$router.push(`/challenge/${challenge_uid}/`)
      }
    }
  }
}
</script>

<style lang="less">
@import "./styles/styles.less";

#title {
  height: 2rem;
  line-height: 2rem;
  margin: 0 -@gutter;
  padding: 0 @gutter;
  font-size: 1.5rem;
  background-color: gray;
  color: white;
}
#editor-box {
  height: 100%;
  width: 50%;
  padding: 0 @gutter;
  float: left;
}
#content-box {
  width: 100%;
  padding: 0 @gutter;
  float: left;

  &.split {
    width: 50%;
  }
}
#split-line {
  height: 100%;
  width: 1rem;
  margin: 0 auto;
  padding-bottom: @gutter * 2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  // cursor: ew-resize;

  &:before {
    content: "";
    height: 100%;
    width: 1px;
    margin: 0 auto;
    background-color: lightgray;
    display: block;
  }

  /*
  &:hover {
    &:before {
      width: 3px;
      border-left: dotted 1px darkgray;
      border-right: dotted 1px darkgray;
      transition: width 0.1s linear;
    }
  }
  */
}
#editor {
  width: 100%;
  height: 100%;
}
#content {
  width: 100%;
}
</style>
