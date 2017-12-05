<template>
  <v-ons-page>
    <v-ons-segment v-if="!md"
      tabbar-id="infinite-scroll-tabbar"
    >
      </v-ons-segment>

    <v-ons-tabbar id="infinite-scroll-tabbar" position="top">
      <v-ons-tab label="My Question" active></v-ons-tab>
      <v-ons-tab label="My Answer"></v-ons-tab>

      <template slot="pages">

        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="myquestion in myquestions" :key="myquestion.id" @click="push_Q(myquestion.id, myquestion.content)" tappable>
              {{ myquestion.content }}
            </v-ons-list-item>
          </v-ons-list>

          <div class="after-list">
            <v-ons-icon icon="fa-spinner" size="26px" spin></v-ons-icon>
          </div>
        </v-ons-page>

        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="myanswer in myanswers" :key="myanswer.id" @click="push_A(myanswer.id, myanswer.content)" tappable>
              {{ myanswer.content }}
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-page>
      </template>
    </v-ons-tabbar>

  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';
import MyQA_Q from './MyQA_Q.vue';
import MyQA_A from './MyQA_A.vue';

export default {
  data() {
    return {
      myquestions: [],
      myanswers: []
    };
  },
  methods: {
    getMyquestions() {
      axios.get(process.env.API_DOMAIN_URL + "v1/posts", {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        Vue.set(this, 'myquestions', response.data["posts"])
        this.$emit('refresh')
      })
    },
    getMyanswers() {
      axios.get(process.env.API_DOMAIN_URL + "v1/posts", {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        Vue.set(this, 'myanswers', response.data["posts"])
        this.$emit('refresh')
      })
    },
    push_Q(post_id, content) {
      this.$store.commit('navigator/push', {
        extends: MyQA_Q,
        data() {
          return {
            // Questions_detailへの継承データ
            post_id: post_id,
            content: content,
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: 'My Q&A',
              title: 'My Question'
            }
          }
        }
      });
    },
    push_A(post_id, content) {
      this.$store.commit('navigator/push', {
        extends: MyQA_A,
        data() {
          return {
            // Questions_detailへの継承データ
            post_id: post_id,
            content: content,
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: 'My Q&A',
              title: 'My Answer'
            }
          }
        }
      });
    }
  },
  mounted() {
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.getMyquestions()
        this.getMyanswers()
      } else {
        results = []
      }
    })
    this.getMyquestions()
    this.getMyanswers()
  }
};
</script>

<style scoped>
.after-list {
  margin: 0px;
  text-align: center;
}
</style>