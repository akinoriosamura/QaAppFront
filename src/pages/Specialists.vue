<template id="Specialists">
  <v-ons-page>
    <div>
      <!--リストアイテムで専門家が並ぶからプロフィールページから取得？-->
      <v-ons-list v-if="user_id==-1">
        <v-ons-list-item v-for="result in results" :key="result.id">
          <div class="left">
            <img class="list-item__thumbnail" v-if="uploadedImage!=''" :src="uploadedImage">
            <img class="list-item__thumbnail" v-else :src="result.image">
          </div>
          <div class="center">
            <span class="list-item__title">{{result.name}}</span>
            <span class="list-item__subtitle">{{ result.email }}</span>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <v-ons-list v-else>
        <v-ons-list-item v-for="result in results" :key="result.id" @click="push(result.id, result.name, result.image, result.document, result.l_price, user_id)" tappable>
          <div class="left">
            <img class="list-item__thumbnail" v-if="uploadedImage!=''" :src="uploadedImage">
            <img class="list-item__thumbnail" v-else :src="result.image">
          </div>
          <div class="center">
            <span class="list-item__title">{{result.name}}</span>
            <span class="list-item__subtitle">{{ result.email }}</span>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';
import Spe_Profile from './Spe_Profile.vue';

export default{
  data(){
    return {
      results:'',
      user_id: -1,
      uploadedImage: '',
    };
  },
  methods: {
    getUsers() {
      axios.get(process.env.API_DOMAIN_URL + "v1/users", {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid'),
          'content-type': 'application/json'
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["users"])
        this.$emit('refresh')
      })
    },
    push(specialist_id, name, image, document, l_price, user_id) {
      this.$store.commit('navigator/push', {
        extends: Spe_Profile,
        data() {
          return {
            // Spe_Profileへの継承データ
            user_id: user_id,
            specialist_id: specialist_id,
            name: name,
            image: image,
            document: document,
            l_price: l_price,
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: '専門家一覧',
              title: "専門家詳細"
            }
          }
        }
      });
    }
  },
  mounted() {
    // ログインしたらuser_idを更新
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.getUsers();
        this.user_id = VueCookie.get('id')
        console.log("myqa after user_id")
        console.log(this.user_id)
      }
    })
    this.getUsers();
    // タブが変わった時に、ログアウト状態ならresultsもログアウト状態（null）にする
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (!this.$store.state.login) {
        this.results = this.$store.state.results
      }
      this.getUsers();
    })
    // タブ遷移後データ更新
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (this.$store.state.login && this.$store.state.tabbar.index==1) {
        this.getUsers();
      }
    })
  }
}
</script>