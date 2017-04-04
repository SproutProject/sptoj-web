<template>
<div id="rank" class="grid">
  <div class="col">
    <template v-for="item in items">
      <div class="grid"><h2 class="col">{{ item.name }}</h2></div>
      <rank-view :proitems="item.proitems" :rankers="item.rankers"></rank-view>
    </template>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import { Component } from 'vue-property-decorator'
import * as API from './api'
import RankView from './components/RankView'

interface RankItem {
  name: string
  proitems: API.ProItem[]
  rankers: API.Ranker[]
}

@Component({
  components: { RankView }
})
export default class Rank extends Vue {
  items: RankItem[] = []

  async getRank(proset: API.ProSet): Promise<RankItem | null> {
    let [proitems, rankers] = await Promise.all([await API.listProItem(proset.uid), await API.getRank(proset.uid)])
    if (proitems !== 'Error' && rankers !== 'Error') {
      return {
        name: proset.name,
        proitems: proitems,
        rankers: rankers,
      }
    }
    return null
  }

  async created() {
    let prosets = await API.listProSet()
    if (prosets !== 'Error') {
      let works = []
      for (let proset of prosets) {
        if (!proset.hidden) {
          works.push(await this.getRank(proset))
        }
      }
      for (let item of await Promise.all(works)) {
        if (item !== null) {
          this.items.push(item)
        }
      }
    }
  }
}
</script>