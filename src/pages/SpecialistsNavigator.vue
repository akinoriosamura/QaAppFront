<template>
  <v-ons-page>
    <v-ons-navigator swipeable
      :page-stack="pageStack"
    >
    </v-ons-navigator>
  </v-ons-page>
</template>

<script>
import Specialists from './Specialists.vue';
export default {
  data() {
    return {
      pageStack: [Specialists]
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
