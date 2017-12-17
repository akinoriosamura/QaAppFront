<template>
  <v-ons-toolbar>
    <div class="left">
      <slot name="left">
        <v-ons-back-button v-if="backLabel">
          {{ backLabel }}
        </v-ons-back-button>
      </slot>
        <!-- 登録 -->
        <v-ons-button @click="register">登録</v-ons-button>
    </div>
    <div class="center"><slot>{{ title }}</slot></div>
    <div class="right">
      <v-ons-button v-if="userName == ''" @click="login">
        <v-ons-icon icon="md-facebook"></v-ons-icon>
      </v-ons-button>
      <v-ons-button v-else @click="logout">
        {{ userName }}
      </v-ons-button>
    </div>
  </v-ons-toolbar>
</template>

<script>
  import VueCookie from 'cookie-in-vue'

  export default {
    props: ['title', 'backLabel'],
    data() {
      return {
        userName: '',
        results: []
      };
    },
    methods: {
      login() {
        var ref = window.open(process.env.API_DOMAIN_URL + 'auth/facebook?auth_origin_url=' + process.env.FRONT_DOMAIN_URL + '&omniauth_window_type=newWindow', "_blank", "location=yes");

        var messanger = setInterval(function() {
          var message = 'requestCredentials';
          ref.postMessage(message, process.env.API_DOMAIN_URL);
        }, 500);
      },
      receiveMessage(rec) {
        if (rec.data != '') {
          if (rec.data['type'] == 'login') {
            this.userName = rec.data['data']['name'];
            VueCookie.set('access-token', rec.data['data']['auth_token']);
            VueCookie.set('client', rec.data['data']['client_id']);
            VueCookie.set('uid', rec.data['data']['uid']);
            VueCookie.set('name', rec.data['data']['name']);
            VueCookie.set('id', rec.data['data']['id']);
            this.$store.commit('set', true);
          }
          // pass user id to parent page
          this.$emit('setId-event', VueCookie.get('id'))
        }
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

        this.userName = ''

        console.log("state")
        console.log(this.$store.state.login)
        console.log(this.userName)
        // send event redirecting home
        this.$emit('logout-event')
      },
      register() {
        var ref = window.open(process.env.API_DOMAIN_URL + 'auth/stripe', "_blank", "location=yes");
      }
    },
    created() {
      window.addEventListener('message', this.receiveMessage, false);
    },
    destroyed() {
      window.removeEventListener('message', this.receiveMessage);
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