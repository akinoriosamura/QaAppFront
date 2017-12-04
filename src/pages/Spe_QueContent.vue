<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
        <textarea v-model="content" placeholder="ここに質問を記入してください。"></textarea>

        <v-ons-button modifier="large" style="margin: 10px 0" @click="setContent">質問</v-ons-button>
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
      content: 'None'
    };
  },
  methods: {
    setContent(content) {
      if (!content) {
        throw new Error('質問を入力してください。')
      } else {
      axios.post(process.env.API_DOMAIN_URL + "v1/posts", {
            headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid')
          }
        })
      .then(response => {
        if (response.status === 200 && response.data.status === 'ok') {
            commit('setContent', state.property.name)
        } else {
            throw new Error('レスポンスエラー')
        }
      })
      }
    }
  }
}
</script>

<style>
</style>