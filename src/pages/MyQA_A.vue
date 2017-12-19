<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>

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

        <v-ons-button modifier="large" style="margin: 10px 0" @click="setAnswer(answer, post_id, post_user_id, price)">回答</v-ons-button>
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
      price: -1,
      content: "not get",
      answer: ""
    };
  },
  methods: {
    getAnswer() {
      console.log("setuser in myqaq getAnswer")
      console.log(this.user_id)
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
    setAnswer(answer, post_id, post_user_id, price) {
      if (!answer) {
        alert('回答を入力してください。')
      } else {
        const data = { user_id: this.user_id, content: answer, post_id: post_id, pv: 0}
        console.log(data);
        axios.post(process.env.API_DOMAIN_URL + "v1/comments", data, {
              headers: {
              'access-token': VueCookie.get('access-token'),
              'client': VueCookie.get('client'),
              'uid': VueCookie.get('uid'),
              'content-type': 'application/json'
            }
          })
        .then(response => {
          console.log('body:', response.data)
          this.charge(post_user_id, price, this.user_id)
        })
        // pop navigator stack and back to previous page
        this.$store.commit('navigator/pop')
      }
    },
    charge(post_user_id, price, specialist_id) {
      // 支払い
      const data = { post_user_id: post_user_id, price: price, specialist_id: specialist_id }
      console.log("data", data)
      // POST token and pay with connect
      axios.post(process.env.API_DOMAIN_URL + "v1/charges/charge", data, {
            headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid')
          }
        })
      .then(response => {
        console.log('body:', response.data)
      })
      .catch( (response) => {
        console.error('error:', response);
      });
    },
    // get login user id from CustomToolbar
    setUserId(user_id) {
      console.log("setuser in myqaa")
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
    console.log("setuser in myqaa")
    console.log(this.user_id)
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