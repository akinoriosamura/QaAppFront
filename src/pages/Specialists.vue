<template>
  <v-ons-page>
    <div>
      <!--リストアイテムで専門家が並ぶからプロフィールページから取得？-->
      <v-ons-list>
        <v-ons-list-item v-for="user in users" :key="index" @click="push" tappable>
          <div class="left">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
          </div>
          <div class="center">
            <span class="list-item__title">{{user.name}}</span>
            <span class="list-item__subtitle">{{user.title}}</span>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import Spe_Profile from './Spe_Profile.vue';
export default{
    data(){
      return {
      users:[]
    };
  },
  methods:{
    getUsers() {
            var url = 'process.env.API_DOMAIN_URL + "v1/users"';
            axios.get(url)
            .then(response => { this.users = response.data["users"]; });
            alert(url);
        },
    push() {
             Event.$emit('push-page', {
               extends: Spe_Profile,
               data() {
                 return {
                   specialistid:id
                }
               }
             });
           }
  },
  mounted() {
      this.getUsers();
  }
}
</script>