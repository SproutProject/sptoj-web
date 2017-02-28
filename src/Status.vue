<template>
<div id="status" v-if="tables !== null">
  <div class="grid" v-for="(table, index) in tables" :ref="`table_${index}`">
    <table class="col challenge-table">
      <thead>
        <tr class="grid">
          <th class="col-1">#</th>
          <th class="col-2">Submitter</th>
          <th class="col">Problem</th>
          <th class="col-2">Result</th>
          <th class="col-1">Runtime</th>
          <th class="col-1">Memory</th>
          <th class="col-2">Timestamp</th>
        </tr>
      </thead>
      <tr v-for="challenge in table.challenges" class="grid">
        <template v-if="challenge === null">
          <td class="col" colspan=7><div class="forbidden"></div></td>
        </template>
        <template v-if="challenge !== null">
          <td class="col-1"><router-link :to="`/challenge/${challenge.uid}/`">{{ challenge.uid }}</router-link></td>
          <td class="col-2"><router-link :to="`/profile/${challenge.submitter.uid}/`">{{ challenge.submitter.name }}</router-link></td>
          <td class="col"><router-link :to="`/problem/${challenge.problem.uid}/`">{{ challenge.problem.name }}</router-link></td>
          <td class="col-2">{{ getResult(challenge.state, challenge.metadata['result']) }}</td>
          <td class="col-1">{{ challenge.metadata['runtime'] }}</td>
          <td class="col-1">{{ challenge.metadata['memory'] }}</td>
          <td class="col-2">{{ challenge.timestamp }}</td>
        </template>
      </tr>
    </table>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as API from './api'

class ChallengeTable {
  challenges: (API.Challenge | null)[]

  constructor(public offset: number, public length=100, public load=false) {}
}

@Component
export default class Status extends Vue {
  total_count: number = 0
  tables: ChallengeTable[] | null = null
  pending_scroll: number | null = null

  // challenges: (API.Challenge | null)[] | null = null

  async created() {
    let partial_list = await API.listChallenge(0)
    if (partial_list !== 'Error') {
      this.total_count = partial_list.count
      
      let tables = []
      let off = 0
      if (this.total_count % 100 > 0) {
        tables.push(new ChallengeTable(0, this.total_count % 100))
        off = this.total_count % 100
      }
      for (; off < this.total_count; off += 100) {
        tables.push(new ChallengeTable(off))
      }
      tables.reverse()
      this.tables = tables

      this.$nextTick(this.update)
    }

    window.addEventListener('scroll', this.onScroll)
  }

  destroyed() {
    window.removeEventListener('scroll', this.onScroll)
  }

  async onScroll() {
    if (this.pending_scroll !== null) {
      clearTimeout(this.pending_scroll);
    }
    this.pending_scroll = setTimeout(async () => {
      this.pending_scroll = null
      await this.update()
    }, 100)
  }

  async update() {
    if (this.tables !== null) {
      let scroll = window.scrollY
      let search_index = 0
      let search_lower = 0
      let search_upper = this.tables.length - 1
      while (search_lower <= search_upper) {
        let mid = Math.floor((search_lower + search_upper) / 2)
        let e_table = (this.$refs[`table_${mid}`] as HTMLDivElement[])[0]
        let top = e_table.getBoundingClientRect().top
        if (top >= 0) {
          search_index = mid
          search_upper = mid - 1
        } else {
          search_lower = mid + 1
        }
      }

      let loading_promise = []
      for (let idx = Math.max(0, search_index - 2); idx < Math.min(this.tables.length, search_index + 2); idx++) {
        let table = this.tables[idx]
        if (!table.load) {
          table.load = true
          API.listChallenge(table.offset).then((partial_list: 'Error' | API.PartialList<API.Challenge | null>) => {
            if (partial_list !== 'Error') {
              table.challenges = partial_list.data.slice(0, table.length).reverse()
              if (this.tables !== null) {
                this.$set(this.tables, idx, table)
              }
            }
          })
        }
      }
    }
  }

  getResult(state: API.JudgeState, result: number): string {
    return API.getResult(state, result)
  }
}
</script>

<style lang="less">
@import "./styles/styles.less";

table.challenge-table {
  min-height: 2rem * 101 + @gutter * 2;
}

div.forbidden {
  height: 1.2rem;
  margin: .4rem 0;
  background-image: repeating-linear-gradient(-45deg, white, white 0.6rem, lightgray 0.6rem, lightgray 1rem);
}
</style>
