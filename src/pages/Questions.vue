<template id="Questions">
  <v-ons-page>
    <v-ons-list>
      <v-ons-lazy-repeat
        :render-item="renderItem"
        :length="100">
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
      var id = 'None'
      var content = 'None'
      if (this.results) {
        id = this.results[i].id
        content = this.results[i].content
      }
      return new Vue({
        template: `
          <v-ons-list-item :key="index">
            <div class="left">
              <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
            </div>
            <div>
              {{ id }}: {{ content }}
            </div>
          </v-ons-list-item>
        `,
        data() {
          return {
            index: i,
            id: id,
            content: content
          };
        },
        methods: {
          push(id) {
            this.$store.commit('navigator/push', {
              extends: Questions_detail,
              data() {
                return {
                  toolbarInfo: {
                    backLabel: '質問',
                    title: id
                  }
                }
              }
            });
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
  // render直前に実行するproperty
  created() {
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.listQuestion()
      } else {
        results = []
      }
    })
    this.results = this.listQuestion()
  }
}
</script>