// Onsen UI Styling and Icons
require('onsenui/css-components-src/src/onsen-css-components.css');
require('onsenui/css/onsenui.css');

import Vue from 'vue';
import Vuex from 'vuex';
import VueOnsen from 'vue-onsenui'; // For UMD
// import VueOnsen from 'vue-onsenui/esm'; // For ESM
// import * as OnsenComponents from './onsen-components'; // For ESM
import VueStripeCheckout from './vue-stripe-index.js';

import storeLike from './store.js';
import CustomToolbar from './partials/CustomToolbar.vue';
import AppNavigator from './AppNavigator.vue';

Vue.use(Vuex);
Vue.use(VueOnsen);

// Register components globally
// Object.values(OnsenComponents).forEach(component => Vue.component(component.name, component)); // For ESM
Vue.component('custom-toolbar', CustomToolbar); // Common toolbar

// base/global options
// these options can be overridden 
// by the options in the .open(options) 
// function.
const options = {
  key: 'pk_test_OMdgx9Y4igUKyIc16n2tuudP',
  currency: 'PHP',
  panelLabel: '{{amount}}円'
}

Vue.use(VueStripeCheckout, options);

new Vue({
  el: '#app',
  render: h => h(AppNavigator),
  store: new Vuex.Store(storeLike),
  beforeCreate() {
    // Shortcut for Material Design
    Vue.prototype.md = this.$ons.platform.isAndroid();

    // Set iPhoneX flag based on URL
    if (window.location.search.match(/iphonex/i)) {
      document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
      document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
    }
  }
});
