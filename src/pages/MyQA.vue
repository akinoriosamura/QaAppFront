<template>
  <v-ons-page>
    <v-ons-tabbar position="top">
      <v-ons-tab label="My Question" active></v-ons-tab>
      <v-ons-tab label="My Answer"></v-ons-tab>

      <template slot="pages">

        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="myquestion in myquestions" :key="myquestion.id" @click="push_Q(myquestion.id, myquestion.content, user_id)" tappable>
              {{ myquestion.content }}
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-page>

        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="myanswer in myanswers" :key="myanswer.id" @click="push_A(myanswer.id, myanswer.content, user_id)" tappable>
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
      user_id: -1,
      myquestions: '',
      myanswers: ''
    };
  },
  methods: {
    getMyquestions() {
      const data = { user_id: this.user_id}
      axios.post(process.env.API_DOMAIN_URL + "v1/posts/myquestions", data, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        console.log('Qbody:', response.data)
        console.log('Qbody:', response.data["posts"])
        if (response.data) {
          Vue.set(this, 'myquestions', response.data["posts"])
        }
        this.$emit('refresh')
      })
    },
    getMyanswers() {
      console.log(this.user_id)
      const data = { user_id: this.user_id}
      axios.post(process.env.API_DOMAIN_URL + "v1/posts/myanswers", data, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        console.log('Abody:', response.data)
        console.log('Abody:', response.data["posts"])
        if (response.data) {
          Vue.set(this, 'myanswers', response.data["posts"])
        }
        this.$emit('refresh')
      })
    },
    push_Q(post_id, content, user_id) {
      this.$store.commit('navigator/push', {
        extends: MyQA_Q,
        data() {
          return {
            // Questions_detailへの継承データ
            user_id: user_id,
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
    push_A(post_id, content, user_id) {
      this.$store.commit('navigator/push', {
        extends: MyQA_A,
        data() {
          return {
            // Questions_detailへの継承データ
            user_id: user_id,
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
    // ログインしたらuser_idを更新
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.user_id = VueCookie.get('id')
        console.log("myqaaaaaaaaaa after user_id")
        console.log(this.user_id)
        this.getMyquestions()
        this.getMyanswers()
      }
    })
    // タブが変わった時に、ログアウト状態ならresultsもログアウト状態（null）にする
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (!this.$store.state.login) {
        this.myquestions = this.$store.state.myquestions
        this.myanswers = this.$store.state.myanswers
      }
    })
  }
};
</script>

<style scoped>
.after-list {
  margin: 0px;
  text-align: center;
}
</style>