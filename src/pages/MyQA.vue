<template>
  <v-ons-page>
    <v-ons-segment v-if="!md"
      tabbar-id="infinite-scroll-tabbar"
    >
      </v-ons-segment>

    <v-ons-tabbar id="infinite-scroll-tabbar" position="top">
      <v-ons-tab label="My Question" active></v-ons-tab>
      <v-ons-tab label="My Answer"></v-ons-tab>

      <template slot="pages">

        <v-ons-page :infinite-scroll="loadMore">
          <v-ons-list>
            <v-ons-list-item v-for="question in myquestions" :key="question" @click="push_Q" tappable>
              Item #{{ question }}
            </v-ons-list-item>
          </v-ons-list>

          <div class="after-list">
            <v-ons-icon icon="fa-spinner" size="26px" spin></v-ons-icon>
          </div>
        </v-ons-page>

        <v-ons-page>
          <v-ons-list>
            <v-ons-list-item v-for="answer in myanswers" :key="answer" @click="push_A" tappable>
              Item #{{ answer }}
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-page>
      </template>
    </v-ons-tabbar>

  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import MyQA_Q from './MyQA_Q.vue'
import MyQA_A from './MyQA_A.vue'

export default {
  data() {
    return {
      myquestions: [],
      myanswers: []
    };
  },
  beforeMount() {
    for (let i = 0; i < 30; i++) {
      this.myquestions.push(i);
      this.myanswers.push(i);
    }
  },
  methods: {
    loadMore(done) {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + i);
        }
        done();
      }, 600)
    },
    push_Q() {
      this.$store.commit('navigator/push', {
        extends: MyQA_Q,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'My Q&A',
              title: 'My Question'
            }
          }
        }
      });
    },
    push_A() {
      this.$store.commit('navigator/push', {
        extends: MyQA_A,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'My Q&A',
              title: 'My Answer'
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.after-list {
  margin: 0px;
  text-align: center;
}
</style>