<template>
<v-ons-page id="specialist">
  <v-ons-page>
    <v-ons-list>
      <v-ons-lazy-repeat
        :render-item="renderItem"
        :length="100"
      >
      </v-ons-lazy-repeat>
    </v-ons-list>
  </v-ons-page>
</v-ons-page>

</template>

<script>
import Vue from 'vue';
import axios from 'axios';
export default{
  data(){
    return{
      results: []
    };
  },
  methods: {
    renderItem(i) {
      var name = 'None'
      if (this.results.length > i) {
        name = this.results[i].name
        title = this.results[i].title
      }
      return new Vue({
        template: `
        <v-ons-list-item :key="index">
        <div class="left">
        <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
        </div>
        <div class="center">
        <span class="list-item__title">{{ name }}</span>
        <span class="list-item__subtitle">{{title}}</span>
        </div>
        </v-ons-list-item>
        `,
        data() {
          return {
            index: i,
            name: name,
            title: title,
          };
        }
      });
    }
  },
  mounted() {
    axios.get(process.env.API_DOMAIN_URL + "v1/users")
    .then(response => {
      Vue.set(this, 'results', response.data["users"])
      this.$emit('refresh')
    })
  }
}
</script>
