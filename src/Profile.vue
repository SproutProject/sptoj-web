<template>
<div id="profile" class="grid" v-if="profile !== null">
  <div class="col-2"><div class="grid">
    <div class="col-12"><ul>
      <li><router-link to="/profile/">Profile</router-link>
      <li v-if="is_admin"><router-link to="/manage/group/">Manage</router-link>
    </ul></div>
    <div class="col-12"><table>
      <tr class="grid">
        <td class="col">Category</td>
        <td class="col">{{ getCategory(profile.category) }}</td>
      </tr>
      <tr class="grid" v-if="profile.rate !== undefined">
        <td class="col">Rate</td>
        <td class="col">{{ profile.rate }}</td>
      </tr>
    </table></div>
  </div></div>
  <div class="col"></div>
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
    let profile = await API.getProfile(user_uid)
    if (profile !== 'Error') {
      this.profile = profile
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
