import Vue from "vue";
import Vuex from "Vuex";
import axios from "axios";
import { CognitoUserPool } from "amazon-cognito-identity-js";

Vue.use(Vuex);

let userPool = new CognitoUserPool({
  UserPoolId: "ap-southeast-2_4hP69ss9p",
  ClientId: "64f654vu8d5vn5fgma9qjct1ha"
});
let loggedIn = "";
userPool.getCurrentUser() === null ? (loggedIn = false) : (loggedIn = true);

export const store = new Vuex.Store({
  state: {
    userPhoto: "",
    searchResults: "",
    info: "",
    menu: [
      {
        icon: "lock_open",
        link: "/login",
        title: "Login",
        show: !loggedIn
      },
      {
        icon: "supervisor_account",
        link: "/signup",
        title: "Signup",
        show: !loggedIn
      },
      {
        icon: "power_settings_new",
        link: "/logout",
        title: "Logout",
        show: loggedIn
      },
      {
        icon: "place",
        link: "/registerBusiness",
        title: "Register Your Business",
        show: loggedIn
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
      state.info = payload;
      state.info.reviews = payload.reviews.reverse();
    },
    updateAllReviews(state, payload) {
      state.info.reviews = payload.reverse();
    },
    searchResults(state, payload) {
      let finalArr = payload.Items.map(e => {
        let ratingArr = e.reviews.map(f => {
          return f.rating;
        });
        let result = ratingArr.reduce((a, b) => {
          return a + b;
        }, 0);
        e.overallRating = Math.round(result / ratingArr.length);
        return e;
      });
      console.log("finalArr is --> ", finalArr);
      state.searchResults = finalArr;
    }
  },
  actions: {
    getSearchResults(context, payload) {
      return axios
        .get(payload.url, { headers: { Authorization: "token" } })
        .then(res => {
          console.log(res.data);
          context.commit("searchResults", res.data);
          return true;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
    },
    commitHideLoginSignup(context) {
      context.commit("hideLoginSignup");
    },
    commitShowLoginSignup(context) {
      context.commit("showLoginSignup");
    },
    addNewRating(context, payload) {
      let url =
        "https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/addrating";
      return axios
        .post(url, payload.data, { headers: { Authorization: payload.token } })
        .then(res => {
          console.log(res.data);
          return axios.get(
            `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/allreviews/${
              payload.data.businessID
            }`,
            { headers: { Authorization: payload.token } }
          );
        })
        .then(resp => {
          console.log("get all reviews request", resp.data);
          context.commit("updateAllReviews", resp.data.Item.reviews);
          return true;
        })
        .catch(err => {
          console.log("err from axios req", err);
        });
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
  }
});
