<template id="Questions">
  <v-ons-page>
    <v-ons-pull-hook
      :action="onAction"
      :fixed-content="md"
      :height="md ? 84 : 64"
      :on-pull="md && onPull || null"
      @changestate="state = $event.state">

      <!--iOS向け -->
      <v-ons-icon v-if="!md"
        size="22px"
        class="pull-hook-spinner"
        :icon="state === 'action' ? 'fa-spinner' : 'fa-arrow-down'"
        :rotate="state === 'preaction' && 180"
        :spin="state === 'action'">
      </v-ons-icon>

      <div v-else class="pull-hook-progress">
        <v-ons-progress-circular
        :value="ratio * 100"
        :indeterminate="state === 'action'"
        :style="{ transform: `rotate(${ratio}turn)` }">

        </v-ons-progress-circular>
      </div>

    </v-ons-pull-hook>

    <v-ons-list>
      <v-ons-lazy-repeat
        :render-item="renderItem"
        :length="100" tappable>
      </v-ons-lazy-repeat>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import Questions_detail from './Questions_detail.vue';
export default {
  data() {
    return {
      results: []
    };
  },
  methods: {
    renderItem(i) {
      var content = 'None'
      var id = 'None'
      if (this.results.length > i) {
        id = this.results[i].id
        content = this.results[i].content
      }

      return new Vue({
        template: `
          <v-ons-list-item :key="index" @click="push">
              Item({{ id }}) #{{ hihihi }}
          </v-ons-list-item>
        `,
        data() {
          return {
            index: i,
            id: id,
            hihihi: content
          };
        },
        methods: {
          push() {
            Event.$emit('push-page', {
              extends: Questions_detail,
              data() {
                return {
                  questionid:id
                }
              }
            });
          }
        }
      });
    }
  },
  mounted() {
    axios.get(process.env.API_DOMAIN_URL + "questions")
    .then(response => {
      Vue.set(this, 'results', response.data)
      this.$emit('refresh')
    })
  }
}
</script>

<style>
.pull-hook-spinner {
  color: #666;
  transition: transform .25s ease-in-out;
}
.pull-hook-progress {
  background-color: white;
  width: 32px;
  height: 32px;
  margin: 30px auto 0;
  border-radius: 100%;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  display: inline-block;
  line-height: 0px;
}
.pull-hook-progress .progress-circular {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 4px;
  left: 4px;
}
.pull-hook-progress .progress-circular__primary {
  transition: stroke-dashoffset 0s;
}
</style>
