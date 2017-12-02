<template>
  <v-ons-page>
        <v-ons-list>
      <v-ons-lazy-repeat
        :render-item="renderItem"
        :length="20">
      </v-ons-lazy-repeat>
    </v-ons-list>
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
    renderItem(i) {
      var name = 'None'
      if (this.results.length > i) {
        name = this.results[i].name
      }
      return new Vue({
        template: `
          <v-ons-list-item :key="index" @click="push">
            Item #{{ name }}
          </v-ons-list-item>
        `,
        data() {
          return {
            index: i,
            name: name 
          };
        },
        methods: {
          push() {
            Event.$emit('push-page', Spe_Profile);
          }
        }
      });
    },
    listUser() {
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
    }
  },
  mounted() {
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.listUser()
      } else {
        results = []
      }
    })
  }
}
</script>