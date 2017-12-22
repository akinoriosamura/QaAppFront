<template>
  <v-ons-page>
    <v-ons-card v-show="results" style="height:100%;text-align:center;">
      <img v-if="uploadedImage!=''" :src="uploadedImage" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
      <img v-else :src="results.image" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
      <div class="title" style="text-align=center center">
        {{ results.name }}
      </div>
      <div class="content">
        <v-ons-list>
          <v-ons-list-header>紹介文</v-ons-list-header>
          <v-ons-list-item>{{ results.document }}</v-ons-list-item>
          <v-ons-list-header>最低回答金額</v-ons-list-header>
          <v-ons-list-item>{{ results.l_price }}</v-ons-list-item>
        </v-ons-list>
      </div>
      <v-ons-button modifier="large" style="margin: 10px 0" @click="push(user_id, results.name, results.image, results.document, results.l_price, uploadedImage)">プロフィール編集</v-ons-button>
      <v-ons-button v-show="role == 'member' || role == 'specialist'" modifier="large" style="margin: 6px 0" @click="cardRegister(user_id, role)">質問者登録</v-ons-button>
      <v-ons-button v-show="role == 'member' || role == 'questioner'" modifier="large" style="margin: 6px 0" @click="register()">回答者登録</v-ons-button>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import VueCookie from 'cookie-in-vue';
import axios from 'axios';
import EditProfile from './EditProfile.vue'

export default {
  data() {
    return {
      results: '',
      profile_image: '',
      user_id: -1,
      uploadedImage: '',
      role: ''
    };
  },
  methods: {
    getUserInfo() {
      axios.get(process.env.API_DOMAIN_URL + "v1/users/" + this.user_id, {
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
        this.$emit('refresh')
      })
    },
    getImage() {
      axios.get(process.env.API_DOMAIN_URL + "v1/images/" + this.user_id, {
        responseType: 'arraybuffer',
        headers: {
          'access-token': VueCookie.get('access-token'),
          'client': VueCookie.get('client'),
          'uid': VueCookie.get('uid')
        }
      })
      .then(response => {
        console.log('getImage:', response.data)
        if (response.data["byteLength"] > 0) {
          // convert arraybuffer to blob for showing
          let blob = new Blob([response.data], {type: "image/png" });
          this.createImage(blob)
        }
        this.$emit('refresh')
      })
    },
    push(user_id, name, image, document, l_price, uploadedImage) {
      this.$store.commit('navigator/push', {
        extends: EditProfile,
        data() {
          return {
            // Spe_Profileへの継承データ
            user_id: user_id,
            name: name,
            image: image,
            document: document,
            l_price: l_price,
            uploadedImage: uploadedImage,
            // toolbarへの継承データ
            toolbarInfo: {
              backLabel: 'プロフィール',
              title: "プロフィール編集"
            }
          }
        }
      });
    },
    uploadRole(role) {
      console.log("uploadRole", role)
      console.log("uploadRole", this.$store.state.role)
      this.$store.commit('changeRole', role);
      console.log("uploadRole", this.$store.state.role)
      const data = { role: role }
      console.log(data)
      if (role) {
        axios.put(process.env.API_DOMAIN_URL + "v1/users/" + this.user_id, data, {
          headers: {
            'access-token': VueCookie.get('access-token'),
            'client': VueCookie.get('client'),
            'uid': VueCookie.get('uid'),
            'content-type': 'application/json'
          }
        })
        .then(response => {
          console.log('body:', response.data)
        })
        .catch( (response) => {
          console.error('error:', response);
        })
      }
    },
    cardRegister(user_id, role) {
      // 質問料金設定 & token獲得 &　支払い
      var vm = this; // Keep reference to viewmodel object
      this.$checkout.open({
        name: 'カード情報登録',
        currency: 'jpy',
        token(token) {
          console.log("token")
          console.log(user_id)
          token.user_id = user_id
          console.log(token)
          // POST token and pay with connect
          axios.post(process.env.API_DOMAIN_URL + "v1/charges", token, {
                headers: {
                'access-token': VueCookie.get('access-token'),
                'client': VueCookie.get('client'),
                'uid': VueCookie.get('uid'),
                'content-type': 'application/json'
              }
            })
          .then(response => {
            console.log('body:', response.data)
            if (role == 'member') {
              role = 'questioner'
            } else if (role == 'specialist') {
              role = 'bothqs'
            }
            console.log("role after card register", role)
            console.log("role after card register", this.role)
            Vue.set(this, 'role', role)
            console.log("role after card register", this.role)
            vm.uploadRole(this.role);
          })
          .catch( (response) => {
            console.error('error:', response);
            alert("カード情報登録ができませんでした。")
          });
        }
      });
    },
    register() {
      var user_id = VueCookie.get('id')
      var ref = window.open(process.env.API_DOMAIN_URL + 'auth/stripe_connect?user_id=' + user_id, "_blank", "location=yes");

      var messanger = setInterval(function() {
        var message = 'requestCredentials';
        ref.postMessage(message, process.env.API_DOMAIN_URL);
      }, 500);
    },
    receiveMessage(rec) {
      // regsterのあとに、role更新&保存
      console.log("receiveMessage")
      console.log(rec.data)
      if (rec.data != '') {
        console.log("this.role", this.role)
        if (this.role == 'member') {
          this.role = 'specialist'
        } else if (this.role == 'questioner') {
          this.role = 'bothqs'
        }
        console.log("this.role", this.role)
        this.uploadRole(this.role)
      }
    },
    // get login user id from CustomToolbar
    setUserId(user_id) {
      this.user_id = user_id
    },
    // logoutを押した時にhomeへリダイレクト
    redirectHome() {
      this.$store.commit('navigator/reset')
      this.$store.commit('tabbar/set', 0)
    },
    // アップロードした画像を表示
    createImage(file) {
      console.log("watch file:", file)
      let reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  },
  // in creating register window
  created() {
    window.addEventListener('message', this.receiveMessage, false);
  },
  // in destoying register window
  destroyed() {
    window.removeEventListener('message', this.receiveMessage);
  },
  mounted() {
    // ログインしたらuser_idを更新
    this.$store.watch((state) => state.login, () => {
      if (this.$store.state.login) {
        this.user_id = VueCookie.get('id')
        this.getUserInfo()
        this.getImage()
      }
    })
    // タブが変わった時に、ログアウト状態ならresultsもログアウト状態（null）にする
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (!this.$store.state.login) {
        this.results = this.$store.state.results
      }
    })
    // 編集後プロフィール更新
    this.$store.watch((state) => this.$store.state.navigator.stack, () => {
      if (this.$store.state.login && this.$store.state.tabbar.index==3) {
        this.getUserInfo()
        this.getImage()
      }
    })
    // タブ遷移後role更新
    this.$store.watch((state) => this.$store.state.tabbar.index, () => {
      if (this.$store.state.login && this.$store.state.tabbar.index==3) {
        console.log("role in register", this.role)
        this.role = this.$store.state.role
        console.log("role in register", this.role)
      }
    })
  }
}
</script>