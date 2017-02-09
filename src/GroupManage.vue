<template>
<div id="group-manage" class="grid">
<div class="col-2">
  <div class="grid">
    <button class="col" @click="onCreateProSet">建立題集</button>
  </div>
  <ul>
    <li v-for="proset in prosets" class="grid grid-noGutter">
      <router-link :to="'/manage/group/' + proset.uid" class="col">{{ proset.name }}</router-link>
      <button class="col-2">
        <i class="fa fa-eye-slash" aria-hidden="true"></i>
      </button>
      <button class="col-2">
        <i class="fa fa-trash-o" aria-hidden="true"></i>
      </button>
    </li>
  </ul>
</div>
<div class="col">
  <div class="grid" v-if="current_proset !== null">
    <div class="col"><input type="text" v-model="current_proset.name"/></div>
    <button class="col-2" @click="onApplyName">儲存名稱</button>
    <button class="col-2" @click="onShowAddProItem">新增題目</button>
  </div>
  <div class="grid" v-show="show_add_proitem">
    <div class="col">
      <select v-model="selected_problem">
        <option v-for="problem in available_problems" :value="problem">{{ problem.name }}
      </select>
    </div>
    <div class="col-4">
      <input type="text" placeholder="期限 (1984/01/01)" disabled/>
    </div>
    <div class="col-2">
      <input type="text" placeholder="章節" disabled/>
    </div>
    <button class="col-1" @click="onAddProItem">加入</button>
    <button class="col-1" @click="show_add_proitem = false">取消</button>
  </div>
  <div class="grid">
    <div v-for="proitem in current_proitems" class="col-12">
      {{ proitem.problem.name }}
    </div>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import * as API from './api.ts'

@Component
export default class GroupManage extends Vue {
  show_add_proitem: boolean = false
  prosets: API.ProSet[] = []
  current_proset: API.ProSet | null = null
  current_proitems: API.ProItem[] | null = null
  available_problems: API.Problem[] = []
  selected_problem: API.Problem | null = null

  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    let result = await API.listProSet()
    if (result !== 'Error') {
      let prosets = result
      next((vm: GroupManage) => {
        vm.prosets = prosets
        vm.onChangeProSet.bind(vm)()
      })
    } else {
      next(false)
    }
  }

  @Watch('$route')
  async onChangeProSet() {
    let result = await API.listProSet()
    if (result !== 'Error') {
      this.prosets = result
    }

    if ('proset_uid' in this.$route.params) {
      let proset_uid: number = parseInt(this.$route.params['proset_uid'])
      let result = await API.getProSet(proset_uid)
      if (result !== 'Error') {
        this.current_proset = result
        let proitems = await API.listProItem(result)
        if (proitems !== 'Error') {
          this.current_proitems = proitems
        }
      }
    } else {
      this.current_proset = null
    }
  }

  async onCreateProSet() {
    let result = await API.createProSet('新題集')
    if (result !== 'Error') {
      let proset_uid: number = result
      this.$router.push(`/manage/group/${proset_uid}`)
    }
  }

  async onApplyName() {
    if (this.current_proset !== null) {
      if (await API.setProSet(this.current_proset) === 'Success') {
        await this.onChangeProSet()
      }
    }
  }

  async onShowAddProItem() {
    let result = await API.listProblem()
    if (result !== 'Error') {
      this.available_problems = result
      this.show_add_proitem = true
    }
  }

  async onAddProItem() {
    if (this.current_proset !== null && this.selected_problem !== null) {
      let result = await API.addProItem(this.current_proset, this.selected_problem)
      if (result !== 'Error') {
        this.show_add_proitem = false
        await this.onChangeProSet()
      }
    }
  }
}
</script>
