<template id="main">
    <v-ons-page>
      <v-ons-toolbar>
        <div class="center">{{ title }}</div>
        <div class="right">
          <v-ons-toolbar-button>
            <v-ons-icon icon="md-menu"></v-ons-icon>
          </v-ons-toolbar-button>
          <v-ons-button v-if="userName == ''" @click="login">
            <v-ons-icon icon="md-facebook"></v-ons-icon>
          </v-ons-button>
          <v-ons-button v-else @click="logout">
            {{ userName }}
          </v-ons-button>
        </div>
      </v-ons-toolbar>

      <v-ons-tabbar swipeable position="bottom"
        :tabs="tabs"
        :visible="true"
        :index.sync="activeIndex"
      >
      </v-ons-tabbar>

    </v-ons-page>
</template>
<script>
  import VueCookie from 'cookie-in-vue'
  import Questions from './pages/QuestionsNavigator.vue'
  import Specialists from './pages/SpecialistsNavigator.vue'
  import MyQA     from './pages/MyQA.vue'
  import Register from './pages/Register.vue'

  export default{
    data() {
      return {
        activeIndex: 0,
        userName: '',
        tabs: [
          {
            icon: 'md-home',
            page: Questions,
            label: '質問',
            key: "questionsPage"
          },
          {
            icon: 'md-view-column',
            page: Specialists,
            label: '専門家',
            key: "specialistsPage"
          },
          {
            icon: 'md-comment-list',
            page: MyQA,
            label: 'My Q&A',
            key: "myqaPage"
          },
          {
            icon: 'md-account',
            page: Register,
            label: '登録',
            key: "registerPage"
          }
        ]
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
            this.$store.commit('set', true);
          }
        }
      },
      logout() {
        VueCookie.remove('access-token');
        VueCookie.remove('client');
        VueCookie.remove('uid');
        this.userName = '';
        this.$store.commit('set', false);
      },
    },
    created() {
      window.addEventListener('message', this.receiveMessage, false);
    },
    destroyed() {
      window.removeEventListener('message', this.receiveMessage);
    },
    computed: {
      title() {
        return this.tabs[this.activeIndex].label;
      }
    }
  };
</script>