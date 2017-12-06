<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>

      <v-ons-card>
          <div class="title"> 質問 </div>
          <div class="content">{{ content }}</div>
      </v-ons-card>

      <v-ons-card v-if="results">
          <div class="answer" v-if="user_id==results.user_id">
            <div class="title"> 回答 </div>
            <div class="content">{{ results.content }}</div>
          </div>
          <v-ons-button v-else modifier="large" style="margin: 10px 0" @click="openAnswer(results.user_id)">閲覧</v-ons-button>
      </v-ons-card>
      <v-ons-card v-else>
          <div class="title"> 回答 </div>
          <div class="content">{{ answer }}</div>
      </v-ons-card>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';

export default {
  data() {
    return {
      results: [],
      user_id: -1,
      post_id: 0,
      content: "not get",
      answer: "未回答"
    };
  },
  methods: {
    getAnswer() {
      // post_controllerにより、post_に紐づくcommentをpost_idを元に取る。
      axios.get(process.env.API_DOMAIN_URL + "v1/posts/" + this.post_id, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["comment"])
        this.$emit('refresh')
      })
    },
    // get login user id from CustomToolbar
    setUserId(user_id) {
      this.user_id = user_id
    },
    // logoutを押した時にhomeへリダイレクト
    redirectHome() {
      this.$store.commit('navigator/reset')
    },
    openAnswer(user_id) {
      // ここに決済のフローを書く。
      this.user_id = user_id
    }
  },
  mounted() {
    this.getAnswer()
  }
}
</script>

<style>
ons-card {
  cursor: pointer;
  color: #333;
}

.card__title, .card--material__title {
  font-size: 20px;
}
</style>