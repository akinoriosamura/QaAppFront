<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
    <v-ons-card v-for="page of pages" :key="label">
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
          desc: 'from my question'
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