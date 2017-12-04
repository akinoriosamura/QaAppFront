<template id="Specialists">
  <v-ons-page>
    <div>
      <!--リストアイテムで専門家が並ぶからプロフィールページから取得？-->
      <v-ons-list>
        <v-ons-list-item v-for="result in results" :key="result.id" @click="push(result.id)" tappable>
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
      results: []
    };
  },
  methods: {
    getContents() {
      axios.get(process.env.API_DOMAIN_URL + "v1/posts", {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["posts"])
        this.$emit('refresh')
      })
    },
    push(key) {
      this.$store.commit('navigator/push', {
        extends: Questions_detail,
        data() {
          return {
            toolbarInfo: {
              backLabel: '質問一覧',
              title: key
            }
          }
        }
      });
    }
  },
  // render直前に実行するproperty
  mounted() {
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.getContents()
      } else {
        results = []
      }
    })
    this.results = this.getContents()
  }
}
</script>