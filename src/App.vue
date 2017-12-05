<template>
  <v-ons-page :style="swipePosition">
    <custom-toolbar :style="swipeTheme" modifier="white-content">
      {{ title }}
    </custom-toolbar>

    <v-ons-tabbar position="auto"
      swipeable
      :modifier="md ? 'autogrow white-content' : null"
      :on-swipe="md ? onSwipe : null"
      :tabbar-style="swipeTheme"
      :tabs="tabs"
      :index.sync="index"
    ></v-ons-tabbar>
  </v-ons-page>
</template>

<script>
  import VueCookie from 'cookie-in-vue'
  import Questions from './pages/Questions.vue'
  import Specialists from './pages/Specialists.vue'
  import MyQA     from './pages/MyQA.vue'
  import Register from './pages/Register.vue'
// Just a linear interpolation formula
const lerp = (x0, x1, t) => parseInt((1 - t) * x0 + t * x1, 10);
// RGB colors
const red = [244, 67, 54];
const blue = [30, 136, 229];
const purple = [103, 58, 183];
export default {
  data () {
    return {
      colors: red,
      animationOptions: {},
      topPosition: 0,
      tabs: [
        {
          label: this.md ? null : '質問',
          icon: 'md-home',
          page: Questions,
          theme: red,
          style: this.md ? { maxWidth: '60px' } : {},
          top: -105 // Toolbar + Tabbar heights
        },
        {
          label: '専門家',
          icon: this.md ? null : 'md-view-column',
          page: Specialists,
          theme: red
        },
        {
          label: 'My Q&A',
          icon: this.md ? null : 'md-comment-list',
          page: MyQA,
          theme: blue
        },
        {
          label: '登録',
          icon: this.md ? null : 'md-account',
          page: Register,
          theme: purple
        }
      ]
    };
  },
  methods: {
    onSwipe(index, animationOptions) {
      // Apply the same transition as ons-tabbar
      this.animationOptions = animationOptions;
      // Interpolate colors and top position
      const a = Math.floor(index), b = Math.ceil(index), ratio = index % 1;
      this.colors = this.colors.map((c, i) => lerp(this.tabs[a].theme[i], this.tabs[b].theme[i], ratio));
      this.topPosition = lerp(this.tabs[a].top || 0, this.tabs[b].top || 0, ratio);
    }
  },
  computed: {
    index: {
      get() {
        return this.$store.state.tabbar.index;
      },
      set(newValue) {
        this.$store.commit('tabbar/set', newValue)
      }
    },
    title() {
      return this.md ? 'Onsen UI' : this.tabs[this.index].title || this.tabs[this.index].label;
    },
    swipeTheme() {
      return this.md && {
        backgroundColor: `rgb(${this.colors.join(',')})`,
        transition: `all ${this.animationOptions.duration || 0}s ${this.animationOptions.timing || ''}`
      }
    },
    swipePosition() {
      return this.md && {
        top: this.topPosition + 'px',
        transition: `all ${this.animationOptions.duration || 0}s ${this.animationOptions.timing || ''}`
      }
    }
  }
};
</script>

<style>
/* Custom 'white-content' modifier */
.page--material .toolbar--white-content__center,
.page--material .toolbar-button--white-content,
.page--material :checked + .tabbar--white-content__button {
  color: white;
}
.page--material .tabbar--white-content__button {
  color: rgba(255, 255, 255, 0.7);
}
.page--material .tabbar--white-content__border {
  background-color: white;
}
</style>
