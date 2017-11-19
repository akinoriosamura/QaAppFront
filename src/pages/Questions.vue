<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-lazy-repeat
      :render-item="renderItem"
      :length="100">
    </v-ons-lazy-repeat>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
export default{
  data(){
    return{
      result:[]
    };
  },
  methods:{
    renderItem(i){
      var content='None'
      if(this.results.length>i){
        content=this.results[i].content
      }
      return new Vue({
        template:`
        <v-ons-list-item :key="index">
          item #{{hihihi}}
        </v-ons-list-item>
        `,
        data(){
          return{
            index: i,
            hihihi: content
          };
        }
      });
    }
  },
  mounted(){
    axios.get("http://rocky-scrubland-17659.herokuapp.com/questions")
    .then(response =>{
      Vue.set(this,'result',response.data)
      this.$emit('refresh')
    })
  }
}
</script>
