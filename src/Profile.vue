<template>
<div id="profile" class="grid" v-if="profile !== null">
  <div class="col-2">
    <div class="grid-1"><h2 class="col">{{ profile.name }}</h2></div>
    <div class="grid-1"><ul class="col">
      <li><router-link to="/profile/">Profile</router-link>
      <li v-if="is_admin"><router-link to="/manage/group/">Manage</router-link>
    </ul></div>
    <div class="grid-1"><table class="col">
      <tr class="grid">
        <td class="col">Category</td>
        <td class="col">{{ getCategory(profile.category) }}</td>
      </tr>
      <tr class="grid" v-if="profile.rate !== undefined">
        <td class="col">Rate</td>
        <td class="col">{{ profile.rate }}</td>
      </tr>
    </table></div>
  </div>
  <div class="col grid">
    <div class="col-3">
      <div class="grid"><h2 class="col">Tried Problems</h2></div>
      <div class="grid"><table class="col">
        <thead>
          <tr class="grid">
            <th class="col-4">#</th>
            <th class="col">Result</th>
          </tr>
        </thead>
        <tr v-for="item in tried_problems" class="grid">
          <td class="col-4"><router-link :to="`/problem/${item.uid}/`">{{ item.uid }}</router-link></td>
          <td class="col">{{ item.result }}</td>
        </tr>
      </table></div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import * as UserSrv from './user-service'
import * as API from './api'

@Component
export default class Profile extends Vue {
  identity: UserSrv.User | null = UserSrv.identity
  profile: API.Profile | null = null
  tried_problems: { uid: number, result: string }[] = []

  @Watch('$route')
  async fetchData() {
    let param_uid: string | undefined = this.$route.params['user_uid']
    let user_uid: number
    if (param_uid !== undefined) {
      user_uid = parseInt(param_uid)
    } else {
      if (this.identity === null) {
        return
      }
      user_uid = this.identity.uid
    }
    let [profile, statistic] = await Promise.all([
      API.getProfile(user_uid),
      API.getUserStatistic(user_uid)
    ])
    if (profile !== 'Error' && statistic !== 'Error') {
      this.profile = profile
      let tried_problems = statistic.tried_problems
      this.tried_problems = Object.keys(tried_problems).map((key: string) => {
        return { uid: parseInt(key), result: API.getResult(undefined, tried_problems[key].result) }
      })
    }
  }

  async created() {
    await this.fetchData()
  }

  get is_admin(): boolean {
    if (this.identity === null || this.profile === null) {
      return false
    } else if(this.identity.uid !== this.profile.uid ) {
      return false
    } else {
      return this.identity.level <= UserSrv.UserLevel.kernel
    }
  }

  getCategory(category: UserSrv.UserCategory): string {
    return API.getCategory(category)
  }
}
</script>
