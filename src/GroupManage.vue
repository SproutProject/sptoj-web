<template>
<div id="group-manage" class="grid">
<div class="col-2">
  <div class="grid">
    <div class="col"><button @click="onCreateProSet">New Collection</button></div>
  </div>
  <ul>
    <li v-for="proset in prosets" class="grid grid-noGutter">
      <div class="col"><router-link :to="`/manage/group/${proset.uid}/`">{{ proset.name }}</router-link></div>
      <div class="col-4"><div class="grid grid-noGutter">
        <div class="col"><i class="fa btn" role="button" :class="proset.hidden ? 'fa-eye-slash' : 'fa-eye'" @click="onToggleProSetHidden(proset)"></i></div>
        <div class="col"><i class="fa fa-trash-o btn" role="button" @click="onRemoveProSet(proset)"></i></div>
      </div></div>
    </li>
  </ul>
</div>
<div class="col" v-if="current_proset !== null">
  <div class="grid">
    <div class="col"><input type="text" v-model="current_proset.name"/></div>
    <div class="col-2">
      <select v-model="current_proset.metadata.category">
          <option :value="0">Universe</option>
          <option :value="1">Algo</option>
          <option :value="2">CLang</option>
          <option :value="3">PyLang</option>
        </select>
      </div>
    <div class="col-1"><button @click="onApplyProSet">Apply</button></div>
    <div class="col-2"><button @click="onShowAddProItem">Add Problem</button></div>
  </div>
  <div class="grid" v-show="show_add_proitem">
    <div class="col">
      <select v-model="selected_problem">
        <option v-for="problem in available_problems" :value="problem">{{ problem.name }}
      </select>
    </div>
    <div class="col-4">
      <input type="text" placeholder="Deadline (1984/01/01+0800)" v-model="selected_deadline"/>
    </div>
    <div class="col-2">
      <input type="text" placeholder="Section" v-model="selected_section"/>
    </div>
    <div class="col-1"><button @click="onAddProItem">Add</button></div>
    <div class="col-2"><button @click="show_add_proitem = false">Cancel</button></div>
  </div>
  <table>
    <tr class="grid">
      <th class="col">Problem</th>
      <th class="col-2">Deadline</th>
      <th class="col-2">Section</th>
      <th class="col-2"></th>
    </tr>
    <tr v-for="proitem in current_proitems" class="grid">
      <td class="col"><router-link :to="`/problem/${proitem.problem.uid}/`">{{ proitem.problem.name }}</td>
      <td class="col-2">
        <input type="text" placeholder="No Deadline" v-model="proitem.deadline"/>
      </td>
      <td class="col-2">
        <input type="text" placeholder="Section" v-model="proitem.metadata.section"/>
      </td>
      <td class="col-2"><div class="grid grid-noGutter">
        <div class="col"><i class="fa fa-floppy-o btn" role="button" @click="onApplyProItem(proitem)"></i></div>
        <div class="col"><i class="fa btn" role="button" :class="proitem.hidden ? 'fa-eye-slash' : 'fa-eye'" @click="onToggleProItemHidden(proitem)"></i></div>
        <div class="col"><i class="fa fa-trash-o btn" role="button" @click="onRemoveProItem(proitem)"></i></div>
      </div></td>
    </tr>
  </table>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as _ from 'lodash'
import { UserCategory } from './user-service'
import * as API from './api'

@Component
export default class GroupManage extends Vue {
  show_add_proitem: boolean = false
  prosets: API.ProSet[] = []
  current_proset: API.ProSet | null = null
  current_proitems: API.ProItem[] = []
  available_problems: API.Problem[] = []
  selected_problem: API.Problem | null = null
  selected_deadline: string | null = null
  selected_section: string = ''

  @Watch('$route')
  async fetchData(reset=true) {
    if (reset) {
      this.current_proset = null
      this.current_proitems = []
    }

    let prosets_result = await API.listProSet()
    if (prosets_result !== 'Error') {
      this.prosets = prosets_result
    }
    if (!('proset_uid' in this.$route.params)) {
      this.current_proset = null
    } else {
      let proset_uid = parseInt(this.$route.params['proset_uid'])
      let [proset_result, proitems_result] = await Promise.all([
        API.getProSet(proset_uid),
        API.listProItem(proset_uid)
      ])
      if (proset_result !== 'Error') {
        this.current_proset = proset_result
      }
      if (proitems_result !== 'Error') {
        this.current_proitems = proitems_result
      }
    }
  }

  async created() {
    await this.fetchData()
  }

  async onCreateProSet() {
    let proset_uid = await API.createProSet('New Colle')
    if (proset_uid !== 'Error') {
      let proset = await API.getProSet(proset_uid)
      if (proset !== 'Error') {
        proset.metadata = { category: UserCategory.universe }
        if (await API.setProSet(proset) === 'Success') {
          this.$router.push(`/manage/group/${proset_uid}/`)
        }
      }
    }
  }
  
  async onApplyProSet() {
    if (this.current_proset !== null) {
      if (await API.setProSet(this.current_proset) === 'Success') {
        await this.fetchData()
      }
    }
  }

  async onToggleProSetHidden(proset: API.ProSet) {
    let modified_proset = _.cloneDeep(proset)
    modified_proset.hidden = !modified_proset.hidden
    if (await API.setProSet(modified_proset) === 'Success') {
      proset.hidden = modified_proset.hidden
    }
  }

  async onRemoveProSet(proset: API.ProSet) {
    if (await API.removeProSet(proset.uid) === 'Success') {
      this.$router.push(`/manage/group/`)
    }
  }

  async onShowAddProItem() {
    this.available_problems = []
    this.selected_problem = null
    this.selected_deadline = null
    this.selected_section = ''
    this.show_add_proitem = true
    let result = await API.listProblem()
    if (result !== 'Error') {
      this.available_problems = result.map(data => data.problem)
    }
  }

  async onAddProItem() {
    if (this.current_proset !== null && this.selected_problem !== null) {
      let proset_uid = this.current_proset.uid
      let proitem_uid = await API.addProItem(proset_uid, this.selected_problem)
      if (proitem_uid !== 'Error') {
        let proitem = await API.getProItem(proset_uid, proitem_uid)
        if (proitem !== 'Error') {
          proitem.deadline = this.selected_deadline
          proitem.metadata = { section: this.selected_section }
          if (await API.setProItem(proset_uid, proitem) === 'Success') {
            this.show_add_proitem = false
            await this.fetchData(false)
          }
        }
      }
    }
  }

  async onToggleProItemHidden(proitem: API.ProItem) {
    if (this.current_proset !== null) {
      let modified_proitem = _.cloneDeep(proitem)
      modified_proitem.hidden = !modified_proitem.hidden;
      if (await API.setProItem(this.current_proset.uid, modified_proitem) === 'Success') {
        proitem.hidden = modified_proitem.hidden;
      }
    }
  }

  async onApplyProItem(proitem: API.ProItem) {
    if (this.current_proset !== null) {
      if (await API.setProItem(this.current_proset.uid, proitem) === 'Success') {}
    }
  }

  async onRemoveProItem(proitem: API.ProItem) {
    if (this.current_proset !== null) {
      if (await API.removeProItem(this.current_proset.uid, proitem.uid) === 'Success') {
        let index = this.current_proitems.indexOf(proitem)
        this.current_proitems.splice(index, 1)
      }
    }
  }
}
</script>
