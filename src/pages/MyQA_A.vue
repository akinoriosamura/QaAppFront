<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>

      <v-ons-card>
          <div class="title"> 質問 </div>
          <div class="content">{{ content }}</div>
      </v-ons-card>

      <v-ons-card v-if="results">
          <div class="title"> 回答 </div>
          <div class="content">{{ results.content }}</div>
      </v-ons-card>
      <v-ons-card v-else>
        <div class="title"> 回答 </div>
        <textarea v-model="answer" placeholder="ここに回答を記入してください。"></textarea>

        <v-ons-button modifier="large" style="margin: 10px 0" @click="setAnswer(answer, post_id)">回答</v-ons-button>
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
      post_id: 0,
      content: "not get",
      answer: ""
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
    setAnswer(answer, post_id) {
      if (!answer) {
        alert('回答を入力してください。')
      } else {
        const data = { user_id: 1, content: answer, post_id: post_id, pv: 0}
        console.log(data);
        axios.post(process.env.API_DOMAIN_URL + "v1/comments", data, {
              headers: {
              'access-token': VueCookie.get('access-token'),
              'client': VueCookie.get('client'),
              'uid': VueCookie.get('uid')
            }
          })
        .then(response => {
          console.log('body:', response.data)
        })
        this.pop()
      }
    },
    pop() {
      this.$store.commit('navigator/pop')
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