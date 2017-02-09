<template>
<div id="group-manage" class="grid">
<div class="col-2">
  <div class="grid">
    <button class="col" @click="onCreateProSet">建立題集</button>
  </div>
  <ul>
    <li v-for="proset in prosets"><router-link :to="'/manage/group/' + proset.uid">{{ proset.name }}</router-link>
  </ul>
</div>
<div class="col">
  <div class="grid" v-if="current_proset !== null">
    <div class="col"><input type="text" v-model="current_proset.name"/></div>
    <button class="col-2" @click="onApplyName">儲存名稱</button>
    <button class="col-2">新增題目</button>
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
  prosets: API.ProSet[] = []
  current_proset: API.ProSet | null = null

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
}
</script>
