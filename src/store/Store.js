import Vue from "vue";
import Vuex from "Vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    menu: [
      {
        icon: "lock_open",
        link: "/login",
        title: "Login",
        show: true
      },
      {
        icon: "supervisor_account",
        link: "/signup",
        title: "Signup",
        show: true
      },
      {
        icon: "account_circle",
        link: "/profile",
        title: "Profile",
        show: false
      },
      {
        icon: "power_settings_new",
        link: "/logout",
        title: "Logout",
        show: false
      },
      {
        icon: "place",
        link: "/registerBusiness",
        title: "Register Your Business",
        show: false
      }
    ]
  },
  mutations: {
    hideLoginSignup() {
      store.state.menu.forEach(e => {
        e.show ? (e.show = false) : (e.show = true);
      });
    },
    showLoginSignup() {
      store.state.menu.forEach(e => {
        !e.show ? (e.show = true) : (e.show = false);
      });
    }
  },
  actions: {
    commitHideLoginSignup(context) {
      context.commit("hideLoginSignup");
    },
    commitShowLoginSignup(context) {
      context.commit("showLoginSignup");
    }
  },
  getter: {}
});
