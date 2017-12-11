import Vue from "vue";
import Vuex from "Vuex";
import axios from "axios";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    info: {
      owner: "reggy mailand",
      businessID: "3ewvsdvwr343242",
      imageUrl: "https://picsum.photos/700/400/?random",
      name: "Nandos Broadway Clinic",
      type: "Restaurant",
      location: {
        street: "345 Boulevard Street",
        city: "Sydney",
        state: "NSw",
        country: "Australia",
        postcode: "Dfu2009"
      },
      phone: "0433872859",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium placeat modi, quidem consequuntur perspiciatis dolorem! Excepturi velit recusandae eaque nihil a! Tempore, illum repellendus deserunt amet quibusdam tenetur voluptas incidunt?",
      hours: [
        { day: "Monday", open: "4:00", close: "2:00" },
        { day: "Tuesday", open: "3:00", close: "2:00" },
        { day: "Wednesday", open: "5:00", close: "1:00" },
        { day: "Thursday", open: "2:00", close: "9:00" },
        { day: "Friday", open: "6:00", close: "2:00" },
        { day: "Saturday", open: "2:00", close: "5:00" },
        { day: "Sunday", open: "5:00", close: "9:00" }
      ]
    },
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
    hideLoginSignup(state) {
      state.menu.forEach(e => {
        e.show ? (e.show = false) : (e.show = true);
      });
    },
    showLoginSignup(state) {
      state.menu.forEach(e => {
        !e.show ? (e.show = true) : (e.show = false);
      });
    },
    singleBusinessInfo(state, payload) {
      console.log("singleBusinessInfo is running", payload);
      state.info = payload;
    }
  },
  actions: {
    commitHideLoginSignup(context) {
      context.commit("hideLoginSignup");
    },
    commitShowLoginSignup(context) {
      context.commit("showLoginSignup");
    },
    getSingleBusiness(context, payload) {
      console.log("getsinglebbusiness is running", payload.url);
      return axios
        .get(payload.url)
        .then(res => {
          console.log("response back after axios request from ddb", res);
          context.commit("singleBusinessInfo", res.data.Item);
          return true;
        })
        .catch(err => {
          return false;
        });
    }
  },
  getter: {}
});
