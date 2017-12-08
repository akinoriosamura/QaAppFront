var script = document.createElement('script');
script.src = 'https://checkout.stripe.com/checkout.js';
document.getElementsByTagName('head')[0].appendChild(script);

const VueStripeCheckout = {
  install(Vue, options) {
    if(!options) {
      console.warn('支払い情報を記入してください');
      return;
    }
    window.addEventListener('load', () => {
      Vue.prototype.$checkout = StripeCheckout.configure(options);
    });
  }
}

export default VueStripeCheckout;