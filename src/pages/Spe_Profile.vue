<template id="Spe_Profile">
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
        <v-ons-card style="height:100%;text-align:center;">
          <img src="https://monaca.io/img/logos/download_image_onsenui_01.png" alt="Onsen UI" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
          <div class="title" style="text-align=center center">
            {{ name }}
          </div>
          <div class="content">
            <v-ons-list>
              <v-ons-list-header>経歴</v-ons-list-header>
              <v-ons-list-item>{{ document }}</v-ons-list-item>
              <v-ons-list-header>対応範囲</v-ons-list-header>
              <v-ons-list-item>{{}}</v-ons-list-item>
              <div class="bottom">
                <v-ons-list-header style="font-weight:bold">最低価格　{{ l_price }}円</v-ons-list-header>
                 <v-ons-button v-if="user_id == ''" modifier="large" style="margin: 6px 0">ログインしてください</v-ons-button>
                <v-ons-button v-else modifier="large" style="margin: 6px 0" @click="push(specialist_id)">この専門家に質問</v-ons-button>
              </div>
            </v-ons-list>
          </div>
        </v-ons-card>
  </v-ons-page>
</template>

<script>
import Spe_QueContent from './Spe_QueContent.vue';
import CustomToolbar from '../partials/CustomToolbar.vue'

export default {
  componetns: {
    CustomToolbar
  },
  data() {
    return {
      user_id: '',
      specialist_id: '',
      name: "None",
      image: "None",
      document: "None",
      l_price: 0
    };
  },
  methods: {
    push() {
      this.$store.commit('navigator/push', {
        extends: Spe_QueContent,
        data(specialist_id) {
          return {
            specialist_id: specialist_id,
            toolbarInfo: {
              backLabel: '専門家詳細',
              title: "質問"
            }
          }
        }
      });
    },
    fromChild() {
      alert("from child");
    }
  },
  mounted() {
    console.log("user_id")
    console.log(this.user_id);
  }
}
</script>