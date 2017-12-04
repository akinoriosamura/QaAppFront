<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
        <textarea v-model="content" placeholder="ここに質問を記入してください。"></textarea>

        <v-ons-button modifier="large" style="margin: 10px 0" @click="setContent(content)">質問</v-ons-button>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';

export default {
  data() {
    return {
      specialist_id: '',
      content: ''
    };
  },
  methods: {
    setContent(content) {
      if (!content) {
        alert('質問を入力してください。')
      } else {
        const data = { user_id: 1, content: content}
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
        this.pop()
      }
    },
    pop() {
      this.$store.commit('navigator/pop')
    }
  }
}
</script>

<style>
</style>