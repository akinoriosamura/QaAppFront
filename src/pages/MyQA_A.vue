<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo" @setId-event="setUserId" @logout-event="redirectHome"></custom-toolbar>

      <v-ons-card>
          <div class="title"> 質問 </div>
          <div class="content">{{ content }}</div>
      </v-ons-card>

      <!-- 編集時編集ボタンと削除ボタン-->
      <v-ons-card v-if="type=='edit'">
        <div class="title"> 回答 </div>
        <textarea class="answer" v-model="answer" placeholder="ここに回答を記入してください。"></textarea>
        <v-ons-button modifier="large" style="margin: 0px 0" @click="editContent(comment_id, answer)">編集</v-ons-button>
        <button style="margin: 0px 0" @click="deleteContent(comment_id)">削除</button>
      </v-ons-card>

      <!-- 回答がある場合、回答を表示-->
      <v-ons-card v-else-if="results" @click="pushEdit(results.id, results.content)" tappable>
          <div class="title"> 回答 </div>
          <div class="content">{{ results.content }}</div>
      </v-ons-card>

      <!-- 回答がない場合新規作成画面-->
      <v-ons-card class="answer_card" v-else>
        <div class="title"> 回答 </div>
        <textarea class="answer" v-model="answer" placeholder="ここに回答を記入してください。"></textarea>

        <v-ons-button v-if="role == 'member' || role == 'questioner'" modifier="large" style="margin: 6px 0" @click="toRegister">回答者登録へ</v-ons-button>
        <v-ons-button v-else modifier="large" style="margin: 10px 0" @click="charge(answer, post_id, post_user_id, price)">回答</v-ons-button>
      </v-ons-card>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';
import MyQA_A from './MyQA_A.vue';

export default {
  data() {
    return {
      results: '',
      user_id: -1,
      post_id: -1,
      post_user_id: -1,
      price: -1,
      content: "not get",
      answer: "",
      role: this.$store.state.role,
      comment_id: -1,
      type: 'create',
    };
  },
  methods: {
    pushEdit(comment_id, answer) {
      this.comment_id = comment_id
      this.answer = answer
      this.type = "edit"
    },
    editContent(comment_id, content) {
      console.log("editContent")
      if (!content) {
        alert('回答を入力してください。')
      } else {
        const data = { content: content }
        console.log(data);
        axios.put(process.env.API_DOMAIN_URL + "v1/comments/" + comment_id, data, {
          headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid'),
            'content-type': 'application/json'
          }
        })
        .then(response => {
          console.log('body:', response.data)
          alert("編集しました。")
        })
        .catch( (response) => {
          console.error('error:', response);
          alert("編集に失敗しました。")
        });
        // pop navigator stack and back to previous page
        this.$store.commit('navigator/reset')
        this.$store.commit('tabbar/set', 2)
      }
    },
    deleteContent(comment_id) {
      axios.delete(process.env.API_DOMAIN_URL + "v1/comments/" + comment_id, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid'),
          'content-type': 'application/json'
        }
      })
      .then(response => {
        console.log('body:', response.data)
        alert("削除しました。")
      })
      .catch( (response) => {
        console.error('error:', response);
        alert("削除に失敗しました。")
      });
      // pop navigator stack and back to previous page
      this.$store.commit('navigator/reset')
      this.$store.commit('tabbar/set', 2)
    },
    toRegister(user_id, price, role) {
      this.$store.commit('navigator/reset')
      this.$store.commit('tabbar/set', 3)
    },
    getAnswer() {
      console.log("setuser in myqaq getAnswer")
      console.log(this.user_id)
      // post_controllerにより、post_に紐づくcommentをpost_idを元に取る。
      axios.get(process.env.API_DOMAIN_URL + "v1/posts/" + this.post_id, {
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid'),
          'content-type': 'application/json'
        }
      })
      .then(response => {
        Vue.set(this, 'results', response.data["comment"])
        this.$emit('refresh')
      })
    },
    charge(answer, post_id, post_user_id, price) {
      var vm = this; // Keep reference to viewmodel
      // 支払い
      const specialist_id = this.user_id
      const data = { post_user_id: post_user_id, price: price, specialist_id: specialist_id }
      console.log("data", data)
      // POST token and pay with connect
      axios.post(process.env.API_DOMAIN_URL + "v1/charges/charge", data, {
            headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid')
          }
        })
      .then(response => {
        console.log('charge_body:', response.data)
        vm.setAnswer(answer, post_id, post_user_id, price)
      })
      .catch( (response) => {
        console.error('error:', response);
      });
    },
    setAnswer(answer, post_id, post_user_id, price) {
      if (!answer) {
        alert('回答を入力してください。')
      } else {
        const data = { user_id: this.user_id, content: answer, post_id: post_id, pv: 0}
        console.log(data);
        axios.post(process.env.API_DOMAIN_URL + "v1/comments", data, {
              headers: {
              'access-token': VueCookie.get('access-token'),
              'client': VueCookie.get('client'),
              'uid': VueCookie.get('uid'),
              'content-type': 'application/json'
            }
          })
        .then(response => {
          console.log('body:', response.data)
          alert("回答しました。MyQ&Aから編集できます。")
        })
        // pop navigator stack and back to previous page
        this.$store.commit('navigator/pop')
      }
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
      this.$store.commit('tabbar/set', 0)
    }
  },
  mounted() {
    console.log("setuser in myqaa")
    console.log(this.user_id)
    this.getAnswer()
  }
}
</script>

<style>
ons-card {
  cursor: pointer;
  color: #333;
}

.card__title, .card--material__title {
  font-size: 20px;
}

.answer_card {
  height: 80%;
}

.answer {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 60%;
  margin: 20px 0 10px 0;
}

</style>