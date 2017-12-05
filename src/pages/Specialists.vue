<template id="Specialists">
  <v-ons-page>
    <div>
      <!--リストアイテムで専門家が並ぶからプロフィールページから取得？-->
      <v-ons-list>
        <v-ons-list-item v-for="result in results" :key="result.id" @click="push(result.id, result.name, result.image, result.document, result.l_price)" tappable>
          <div class="left">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
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
      results:[]
    };
  },
  methods: {
    getUsers() {
      axios.get(process.env.API_DOMAIN_URL + "v1/users", {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["users"])
        this.$emit('refresh')
      })
    },
    push(id, name, image, document, l_price) {
      this.$store.commit('navigator/push', {
        extends: Spe_Profile,
        data() {
          return {
            // Spe_Profileへの継承データ
            specialist_id: id,
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
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.getUsers();
      } else {
        results = []
      }
    })
    this.getUsers();
  }
}
</script>