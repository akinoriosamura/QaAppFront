<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>
    <v-ons-card style="height:100%;text-align:center;">
      <div class="img">
        <img v-if="uploadedImage" :src="uploadedImage" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
        <img v-else src="image" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
      </div>
      <div class="upload">
        <input type="file" v-on:change="onFileChange">
      </div>
      <div class="title" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
      </div>
      <div class="content">
        <v-ons-list>
          <v-ons-list-header>名前</v-ons-list-header>
          <v-ons-list-item>
            <textarea v-model="name" placeholder="name"></textarea>
          </v-ons-list-item>
          <v-ons-list-header>紹介文</v-ons-list-header>
          <v-ons-list-item>
            <textarea v-model="document" placeholder="紹介文"></textarea>
          </v-ons-list-item>
          <v-ons-list-header>最低回答金額</v-ons-list-header>
          <v-ons-list-item>
            <v-ons-input v-model="l_price" placeholder="半角数字のみ記入してください"></v-ons-input>
          </v-ons-list-item>
        </v-ons-list>
      </div>
      <v-ons-button modifier="large" style="margin: 10px 0" @click="edit">編集</v-ons-button>
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
      name: '',
      image: '',
      document: '',
      l_price: -1,
      uploadedImage: ''
    };
  },
  methods: {
    edit() {
/*      const data = { user_id: this.user_id, name: this.name, image: this.files[0], document: this.document, l_price: this.l_price }*/
      const data = { user_id: this.user_id, name: this.name, document: this.document, l_price: this.l_price }
      axios.put(process.env.API_DOMAIN_URL + "v1/users/" + this.user_id, data, {
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
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.createImage(files[0]);
    },
    // アップロードした画像を表示
    createImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
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
  }
}
</script>