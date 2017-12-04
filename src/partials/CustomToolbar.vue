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
        }
      },
      logout() {
        VueCookie.remove('access-token');
        VueCookie.remove('client');
        VueCookie.remove('uid');
        VueCookie.remove('name');
        VueCookie.remove('id');
        this.userName = '';
        this.$store.commit('set', false);
      }
    },
    created() {
      window.addEventListener('message', this.receiveMessage, false);
    },
    destroyed() {
      window.removeEventListener('message', this.receiveMessage);
    }
  };

</script>