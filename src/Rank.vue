<template>
<div id="index" class="grid">
<div class="col">This page is intentionally left blank.</div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import { Component } from 'vue-property-decorator'
import * as API from './api'

@Component
export default class Rank extends Vue {
  async created() {
    let prosets = await API.listProSet()
    if (prosets !== 'Error') {
      for (let proset of prosets) {
        if (!proset.hidden) {
          let rank = await API.getRank(proset.uid)
          if (rank !== 'Error') {
            console.log(rank)
          }
        }
      }
    }
  }
}
</script>
