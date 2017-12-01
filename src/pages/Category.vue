<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>専門家一覧</v-ons-back-button>
      </div>
      <div class="center">専門家</div>
    </v-ons-toolbar>
        <v-ons-card style="height:100%;text-align:center;">
          <img src="https://monaca.io/img/logos/download_image_onsenui_01.png" alt="Onsen UI" style="border-radius:50%; height:100px; width:100px; margin: 0 auto;">
          <div class="title" style="text-align=center center">
            テスト{{SpecialistName}}
          </div>
          <div class="content">
            <v-ons-list>
              <v-ons-list-header>経歴</v-ons-list-header>
              <v-ons-list-item>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</v-ons-list-item>
              <v-ons-list-header>対応範囲</v-ons-list-header>
              <v-ons-list-item>あああああああああああああ</v-ons-list-item>
              <div class="bottom">
              <v-ons-list-header style="font-weight:bold">最低価格　500円</v-ons-list-header>
              <v-ons-button modifier="large" style="margin: 6px 0" @click="">君に決めた！</v-ons-button>
            </div>
            </v-ons-list>
          </div>
        </v-ons-card>
  </v-ons-page>
</template>

<script>
export default {
}
</script>
