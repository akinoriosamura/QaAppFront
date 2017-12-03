<template>
  <v-ons-page>
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button>質問一覧</v-ons-back-button>
      </div>
      <div class="center">
        質問詳細(ID = {{ questionid }})
      </div>
    </v-ons-toolbar>
    <v-ons-card v-for="page of pages">
      <div class="title">{{ page.label }}</div>
      <div class="content">{{ page.desc }}</div>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        {
          label: 'Question',
          desc: '三軒茶屋で一番美味しい牛丼屋は？'
        },
        {
          label: 'Answer',
          desc: '吉野家一択です。'
        }
      ],
      questionid: -1
    }
  },
  computed: {
    ComputedId() {
      return this.questionid
    }
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
</style>