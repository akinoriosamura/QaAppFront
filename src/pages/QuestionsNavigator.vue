<template>
  <v-ons-page>

    <v-ons-navigator swipeable
      :page-stack="pageStack"
    >
    </v-ons-navigator>

  </v-ons-page>
</template>

<script>
import Questions from './Questions.vue';
export default {
  data() {
    return {
      pageStack: [Questions]
    };
  },
  created() {
    Event.$on('push-page', this.setDetail);
  },
  methods: {
    setDetail(event) {
      this.pageStack.push(event);
    }
  }
}
</script>