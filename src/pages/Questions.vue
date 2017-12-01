<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-lazy-repeat
        :render-item="renderItem"
        :length="50">
      </v-ons-lazy-repeat>
    </v-ons-list>
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
    renderItem(i) {
      var content = 'None'
      if (this.results.length > i) {
        content = this.results[i].content
      }
      return new Vue({
        template: `
          <v-ons-list-item :key="index" @click="push">
            Item #{{ content }}
          </v-ons-list-item>
        `,
        data() {
          return {
            index: i,
            content: content 
          };
        },
        methods: {
          push() {
            Event.$emit('push-page', Questions_detail);
          }
        }
      });
    },
    listQuestion() {
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
    }
  },
  mounted() {
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.listQuestion()
      } else {
        results = []
      }
    })
  }
}
</script>