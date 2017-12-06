<template>
  <v-ons-page>
    <v-ons-card v-show="results" style="height:100%;text-align:center;">
      <img src="https://monaca.io/img/logos/download_image_onsenui_01.png" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
      <div class="title" style="text-align=center center">
        {{ results.name }}
      </div>
      <div class="content">
        <v-ons-list>
          <v-ons-list-header>紹介文</v-ons-list-header>
          <v-ons-list-item>{{ results.document }}</v-ons-list-item>
          <v-ons-list-header>最低回答金額</v-ons-list-header>
          <v-ons-list-item>{{ results.l_price }}</v-ons-list-item>
        </v-ons-list>
      </div>
      <v-ons-button modifier="large" style="margin: 10px 0" @click="push(user_id, results.document, results.name, results.l_price)">プロフィール編集</v-ons-button>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';
import EditProfile from './EditProfile.vue'

export default {
  data() {
    return {
      results: '',
      user_id: -1,
      image: ''
    };
  },
  methods: {
    getInfo() {
      axios.get(process.env.API_DOMAIN_URL + "v1/users/" + this.user_id, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["user"])
        this.$emit('refresh')
      })
    },
    push(user_id, name, document, l_price) {
      this.$store.commit('navigator/push', {
        extends: EditProfile,
        data() {
          return {
            // Spe_Profileへの継承データ
            user_id: user_id,
            name: name,
            document: document,
            l_price: l_price,
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: 'プロフィール',
              title: "プロフィール編集"
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
  },
  mounted() {
    // ログインしたらuser_idを更新
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.user_id = VueCookie.get('id')
        this.getInfo()
      }
    })
    // タブが変わった時に、ログアウト状態ならresultsもログアウト状態（null）にする
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (!this.$store.state.login) {
        this.results = this.$store.state.results
      }
    })
  }
}
</script>