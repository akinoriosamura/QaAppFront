<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>

      <v-ons-card @click="pushEdit(post_id, content)" tappable>
          <div class="title"> 質問 </div>
          <div class="content">{{ content }}</div>
      </v-ons-card>

      <v-ons-card v-if="results">
          <div class="title"> 回答 </div>
          <div class="content">{{ results.content }}</div>
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
import Spe_QueContent from './Spe_QueContent.vue';

export default {
  data() {
    return {
      results: '',
      user_id: -1,
      post_id: -1,
      content: "not get",
      answer: "未回答"
    };
  },
  methods: {
    pushEdit(post_id, content) {
      this.$store.commit('navigator/push', {
        extends: Spe_QueContent,
        data() {
          return {
            // Spe_QueContentへの継承データ
            post_id: post_id,
            content: content,
            type: 'edit',
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: 'My Question',
              title: "編集"
            }
          }
        }
      });
    },
    getAnswer() {
      console.log("setuser in myqaq getanswer")
      console.log(this.user_id)
      // post_controllerにより、post_に紐づくcommentをpost_idを元に取る。
      axios.get(process.env.API_DOMAIN_URL + "v1/posts/" + this.post_id, {
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
      console.log("setuser in myqaq")
      console.log(this.user_id)
      this.user_id = user_id
      console.log(this.user_id)
    },
    // logoutを押した時にhomeへリダイレクト
    redirectHome() {
      this.$store.commit('navigator/reset')
      this.$store.commit('tabbar/set', 0)
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