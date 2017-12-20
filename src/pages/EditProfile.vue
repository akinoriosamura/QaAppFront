<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>
    <v-ons-card style="height:100%;text-align:center;">
      <div class="img">
        <img v-if="uploadedImage!=''" :src="uploadedImage" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
        <img v-else :src="image" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
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
            <div class="name">
              <v-ons-input class="name"v-model="name" placeholder="name"></v-ons-input>
            </div>
          </v-ons-list-item>
          <v-ons-list-header>紹介文</v-ons-list-header>
          <v-ons-list-item class="document-item">
            <textarea class="document" v-model="document" placeholder="紹介文"></textarea>
          </v-ons-list-item>
          <v-ons-list-header>最低回答金額</v-ons-list-header>
          <v-ons-list-item>
            <v-ons-input v-model="l_price" placeholder="半角数字のみ記入してください"></v-ons-input>
          </v-ons-list-item>
        </v-ons-list>
      </div>
      <v-ons-button modifier="large" style="margin: 10px 0" @click="edit(user_id, name, document, l_price, saveFile)">編集</v-ons-button>
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
      uploadedImage: '',
      saveFile: ''
    };
  },
  methods: {
    edit(user_id, name, document, l_price, saveFile) {
      //save profile info othar than image
      // 最低金額が半角数字以外ならアラート
      if (l_price.match(/[^0-9]+/)) {
        alert("半角数字のみを入力してください。");
      } else {
        const data = { user_id: user_id, name: name, document: document, l_price: l_price }
        console.log(data)
        axios.put(process.env.API_DOMAIN_URL + "v1/users/" + this.user_id, data, {
          headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid'),
            'content-type': 'application/json'
          }
        })
        .then(response => {
          console.log('body:', response.data)
        })
        // save imagge
        // {filename: file.name, file: file}
        console.log("formData1")
        const formData = new FormData();
        formData.append('image[user_id]', user_id);
        formData.append('image[filename]', "profile_image");
        formData.append('image[file]', saveFile);
        console.log(formData)
        if (formData) {
          axios.put(process.env.API_DOMAIN_URL + "v1/images/" + this.user_id, formData, {
            headers: {
              'access-token': VueCookie.get('access-token'),
              'client': VueCookie.get('client'),
              'uid': VueCookie.get('uid'),
              'content-type': 'multipart/form-data'
            }
          })
          .then(response => {
            console.log('body:', response.data)
          })
          .catch( (response) => {
            console.error('error:', response);
          });
        }
        // pop navigator stack and back to previous page
        this.$store.commit('navigator/pop')
      }
    },
    // アップロードしたデータにファイルチェンジ
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      this.createImage(files[0]);
    },
    // アップロードした画像を表示
    createImage(file) {
      this.saveFile = file
      console.log("watch file:", file)
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
      //this.$store.commit('tabbar/set', 0)
    }
  }
}
</script>

<style>
.document-item {
  height: 200px;
}
.document {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  border:none;
}
</style>
