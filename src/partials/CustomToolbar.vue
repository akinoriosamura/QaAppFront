<template>
  <v-ons-toolbar>
    <div class="left">
      <slot name="left">
        <v-ons-back-button v-if="backLabel">
          {{ backLabel }}
        </v-ons-back-button>
      </slot>
    </div>
    <div class="center"><slot>{{ title }}</slot></div>
    <div class="right">
      <v-ons-button v-if="userName == ''" @click="login">
        Facebook登録/ログイン
      </v-ons-button>
      <v-ons-button v-else @click="logout">
        ログアウト
      </v-ons-button>
    </div>
  </v-ons-toolbar>
</template>

<script>
  import Vue from 'vue';
  import VueCookie from 'cookie-in-vue'
  import axios from 'axios';

  export default {
    props: ['title', 'backLabel'],
    data() {
      return {
        userName: '',
        user_id: '',
        results: []
      };
    },
    methods: {
      login() {
        var info = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, title=no';
        var ref = window.open(process.env.API_DOMAIN_URL + 'auth/facebook?auth_origin_url=' + process.env.FRONT_DOMAIN_URL + '&omniauth_window_type=newWindow', "_blank", info);

        var messanger = setInterval(function() {
          var message = 'requestCredentials';
          ref.postMessage(message, process.env.API_DOMAIN_URL);
        }, 500);
      },
      receiveLoginMessage(rec) {
        // responseを持ち、かつstripe登録時以外のとき、cookie更新。
        // stripe更新時のみrec.data['data']['id']==null(他SNS登録のときは要確認)
        console.log("receiveLoginMessage")
        console.log(rec.data)
        if (rec.data != '') {
          if (rec.data['type'] == 'login') {
            // stripe登録のときのみname="stripe_connect"を持つ。これにより、register.vueの登録createとの判別を行う。
            if (rec.data['data']['name'] != "stripe_connect") {
              this.userName = rec.data['data']['name'];
              this.user_id = rec.data['data']['id'];
              VueCookie.set('access-token', rec.data['data']['auth_token']);
              VueCookie.set('client', rec.data['data']['client_id']);
              VueCookie.set('uid', rec.data['data']['uid']);
              VueCookie.set('name', rec.data['data']['name']);
              VueCookie.set('id', rec.data['data']['id']);
              this.$store.commit('set', true);
              console.log("user_id in CustomToolbar.vue 1:", this.user_id)
              this.getUserInfo(this.user_id)
            }
          }
          // pass user id to parent page
          this.$emit('setId-event', VueCookie.get('id'))
        }
      },
      getUserInfo(user_id) {
        console.log("user_id in CustomToolbar.vue 2:", user_id)
        axios.get(process.env.API_DOMAIN_URL + "v1/users/" + user_id, {
          headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid'),
            'content-type': 'application/json'
          }
        })
        .then(response => {
          console.log('getInfo:', response.data)
          Vue.set(this, 'results', response.data["user"])
          console.log("role in customtoolbar");
          console.log("before role", this.$store.state.role);
          this.$store.commit('changeRole', response.data["user"]["role"]);
          console.log("updated role", this.$store.state.role);
          this.$emit('refresh')
        })
      },
      logout() {
        VueCookie.remove('access-token');
        VueCookie.remove('client');
        VueCookie.remove('uid');
        VueCookie.remove('name');
        VueCookie.remove('id');

        console.log("state_be")
        console.log(this.$store.state.login)
        console.log(this.userName)
        // pass user id -1 to parent page for logout user
        this.$emit('setId-event', -1)
        this.$store.commit('set', false)
        this.$store.commit('changeRole', -1)

        this.userName = ''

        console.log("state")
        console.log(this.$store.state.login)
        console.log(this.userName)
        // send event redirecting home
        this.$emit('logout-event')
      }
    },
    created() {
      window.addEventListener('message', this.receiveLoginMessage, false);
    },
    destroyed() {
      window.removeEventListener('message', this.receiveLoginMessage);
    },
    mounted() {
      // ログイン状態なら名前を入れる。ログアウト状態ならnilを代入
      console.log("mounte1")
      console.log(this.$store.state.login)
      if (this.$store.state.login) {
        this.userName = VueCookie.get('name');
      } else {
        this.userName = ''
      }
    },
    beforeUpdate() {
      // ログイン状態なら名前を入れる。ログアウト状態ならnilを代入
      console.log("mounted3")
      console.log(this.$store.state.login)
      if (this.$store.state.login) {
        this.userName = VueCookie.get('name');

      } else {
        this.userName = ''
      }
    }
  };
</script>