<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>

      <v-ons-card>
          <div class="title"> 質問 </div>
          <div class="content">{{ content }}</div>
      </v-ons-card>

      <v-ons-card v-if="results">
            <v-ons-button v-if="user_id == -1" modifier="large" style="margin: 10px 0">ログインしてください</v-ons-button>
          <!-- 質問者と回答者、閲覧料支払い済み者（view = true）のみ回答を閲覧可能 -->
          <div class="answer" v-else>
            <div class="title"> 回答 </div>
            <div class="content">{{ results.content }}</div>
          </div>
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
      results: '',
      user_id: -1,
      post_id: -1,
      post_user_id: -1,
      content: "not get",
      answer: "未回答"
    };
  },
  methods: {
    getAnswer() {
      // post_controllerにより、post_に紐づくcommentをpost_idを元に取る。veiwsモデルに閲覧者と閲覧コメントの各IDを保存。post_idとのヒモ付によりコメントを表示するためpostsAPIによりGET。
      const data = { user_id: this.user_id }
      axios.post(process.env.API_DOMAIN_URL + "v1/posts/comment/" + this.post_id, data, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid'),
          'content-type': 'application/json'
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
    }
  },
  mounted() {
    if (this.$store.state.login) {
      this.getAnswer()
    }
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