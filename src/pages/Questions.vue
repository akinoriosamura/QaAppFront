<template id="Specialists">
  <v-ons-page>
    <div>
      <!--リストアイテムで専門家が並ぶからプロフィールページから取得？-->
      <v-ons-list v-if="user_id==-1">
        <v-ons-list-item v-for="result in results" :key="result.id">
          <div class="left">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
          </div>
          <div class="center">
            <span class="list-item__title">{{result.content}}</span>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <v-ons-list v-else>
        <v-ons-list-item v-for="result in results" :key="result.id" @click="push(result.id, result.content, user_id, result.user_id)" tappable>
          <div class="left">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
          </div>
          <div class="center">
            <span class="list-item__title">{{result.content}}</span>
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
import Questions_detail from './Questions_detail.vue';

export default {
  data() {
    return {
      results: '',
      user_id: -1,
    };
  },
  methods: {
    getContents() {
      axios.get(process.env.API_DOMAIN_URL + "v1/posts", {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid'),
          'content-type': 'application/json'
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["posts"])
        this.$emit('refresh')
      })
    },
    push(post_id, content, user_id, post_user_id) {
      this.$store.commit('navigator/push', {
        extends: Questions_detail,
        data() {
          return {
            // Questions_detailへの継承データ
            user_id: user_id,
            post_id: post_id,
            post_user_id: post_user_id,
            content: content,
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: '質問一覧',
              title: "質問詳細"
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
        this.getContents()
        this.user_id = VueCookie.get('id')
        console.log("myqa after user_id")
        console.log(this.user_id)
      }
    })
    this.getContents()
    // タブが変わった時に、ログアウト状態ならresultsもログアウト状態（null）にする
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (!this.$store.state.login) {
        this.results = this.$store.state.results
      }
      this.getContents()
    })
    // タブ遷移後データ更新
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (this.$store.state.login && this.$store.state.tabbar.index==0) {
        this.getContents()
      }
    })
  }
}
</script>