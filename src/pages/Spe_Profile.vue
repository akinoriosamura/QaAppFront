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
                <v-ons-list-header style="font-weight:bold">最低質問金額 {{ l_price }}円</v-ons-list-header>
                <v-ons-input v-model="price" placeholder="質問金額を入力"></v-ons-input>
                 <v-ons-button v-if="role == ''" modifier="large" style="margin: 6px 0">ログインしてください</v-ons-button>
                 <v-ons-button v-else-if="role == 'member' || role == 'specialist'" modifier="large" style="margin: 6px 0" @click="toRegister">カード情報登録へ</v-ons-button>
                <v-ons-button v-else modifier="large" style="margin: 6px 0" @click="push(user_id, specialist_id, l_price, price)">この専門家に質問</v-ons-button>
              </div>
            </v-ons-list>
          </div>
        </v-ons-card>
  </v-ons-page>
</template>

<script>
import Spe_QueContent from './Spe_QueContent.vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';

export default {
  data() {
    return {
      results: [],
      user_id: -1,
      specialist_id: -1,
      name: "None",
      image: "None",
      document: "None",
      l_price: -1,
      price: '',
      role: this.$store.state.role
    };
  },
  methods: {
    toRegister(user_id, price, role) {
      this.$store.commit('navigator/reset')
      this.$store.commit('tabbar/set', 3)
    },
    push(user_id, specialist_id, l_price, price) {
      if (price.match(/[^0-9]+/)) {
        alert("半角数字のみを入力してください。");
      } else if (price < l_price) {
        alert("質問金額は最低質問金額以上で設定してください。")
      } else {
        console.log(this.user_id)
        this.$store.commit('navigator/push', {
          extends: Spe_QueContent,
          data() {
            return {
              user_id: user_id,
              specialist_id: specialist_id,
              l_price: l_price,
              price: price,
              toolbarInfo: {
                backLabel: '専門家詳細',
                title: "質問"
              }
            }
          }
        });
      }
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