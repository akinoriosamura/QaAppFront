<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>
        <textarea v-model="content" placeholder="ここに質問を記入してください。"></textarea>

        <v-ons-button modifier="large" style="margin: 10px 0" @click="setContent(user_id, content, specialist_id)">{{ l_price }} 円で質問</v-ons-button>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';

export default {
  data() {
    return {
      user_id: -1,
      specialist_id: -1,
      l_price: -1,
      content: ''
    };
  },
  methods: {
    setContent(user_id, content, specialist_id) {
      if (!content) {
        alert('質問を入力してください。')
      } else {
        const data = { user_id: user_id, content: content, target_id: specialist_id}
        console.log(data);
        axios.post(process.env.API_DOMAIN_URL + "v1/posts", data, {
              headers: {
              'access-token': VueCookie.get('access-token'),
              'client': VueCookie.get('client'),
              'uid': VueCookie.get('uid')
            }
          })
        .then(response => {
          console.log('body:', response.data)
        })
        // pop navigator stack and back to previous page
        this.$store.commit('navigator/pop')
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

<style>
</style>