<template>
  <v-ons-page>
    <v-ons-tabbar swipeable position="top"
      :tabs="tabs"
      :visible="true"
      :index.sync="activeIndex2"
    >
    </v-ons-tabbar>
  </v-ons-page>
</template>

<script>
import QuestionsNavigator from './QuestionsNavigator.vue'
import SpecialistsNavigator from'./SpecialistsNavigator.vue'

export default {
  data() {
    return {
      activeIndex2: 0,
      tabs: [
        {
          label: '質問',
          page: QuestionsNavigator
        },
        {
          label: '専門家',
          page: SpecialistsNavigator
        }
      ]
    }
  }
}
</script>
