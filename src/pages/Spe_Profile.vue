<template id="Spe_Profile">
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>
        <v-ons-card style="height:100%;text-align:center;">
          <img src="https://monaca.io/img/logos/download_image_onsenui_01.png" alt="Onsen UI" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
          <div class="title" style="text-align=center center">
            {{ name }}
          </div>
          <div class="content">
            <v-ons-list>
              <v-ons-list-header>紹介文</v-ons-list-header>
              <v-ons-list-item>{{ document }}</v-ons-list-item>
              <div class="bottom">
                <v-ons-list-header style="font-weight:bold">最低価格　{{ l_price }}円</v-ons-list-header>
                 <v-ons-button v-if="user_id == -1" modifier="large" style="margin: 6px 0">ログインしてください</v-ons-button>
                <v-ons-button v-else modifier="large" style="margin: 6px 0" @click="push(user_id, specialist_id)">この専門家に質問</v-ons-button>
              </div>
            </v-ons-list>
          </div>
        </v-ons-card>
  </v-ons-page>
</template>

<script>
import Spe_QueContent from './Spe_QueContent.vue';

export default {
  data() {
    return {
      user_id: -1,
      specialist_id: -1,
      name: "None",
      image: "None",
      document: "None",
      l_price: 0
    };
  },
  methods: {
    push(user_id, specialist_id) {
      console.log(this.user_id)
      this.$store.commit('navigator/push', {
        extends: Spe_QueContent,
        data() {
          return {
            user_id: user_id,
            specialist_id: specialist_id,
            toolbarInfo: {
              backLabel: '専門家詳細',
              title: "質問"
            }
          }
        }
      });
    },
    // get login user id from CustomToolbar
    setUserId(user_id) {
      this.user_id = user_id
    },
    // logoutを押した時にhomeへリダイレクト
    redirectHome() {
      this.$store.commit('navigator/reset')
      this.$store.commit('tabbar/set', 0)
    }
  }
}
</script>