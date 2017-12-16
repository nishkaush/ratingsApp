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
    showResultsBtn: "",
    userPhoto: "",
    username: "",
    userEmail: "",
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
        icon: "mood",
        link: "/profile",
        title: "Profile",
        show: loggedIn
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
    DefaultToNewUserPic(state, payload) {
      state.userPhoto = payload.userPhoto;
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
    updateUserPic(state, payload) {
      state.userEmail = payload.userEmail;
      state.userPhoto = payload.userPhoto;
      state.username = payload.username;
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
      state.searchResults = finalArr;
    }
  },

  actions: {
    getSearchResults(context, payload) {
      return axios
        .get(payload.url, { headers: { Authorization: "token" } })
        .then(res => {
          context.commit("searchResults", res.data);
          return true;
        })
        .catch(err => {
          return false;
        });
    },
    showProfileAfterLogin(context) {
      context.commit("hideLoginSignup");
    },
    commitHideLoginSignup(context, payload) {
      let url =
        "https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/registeruser";
      let myobj = {
        username: payload.u,
        userPhoto: payload.p,
        userEmail: payload.e
      };
      return axios
        .post(url, myobj, { headers: { Authorization: payload.t } })
        .then(res => {
          context.commit("hideLoginSignup");
          return true;
        })
        .catch(err => {
          return false;
        });
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
          return axios.get(
            `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/allreviews/${
              payload.data.businessID
            }`,
            { headers: { Authorization: payload.token } }
          );
        })
        .then(resp => {
          context.commit("updateAllReviews", resp.data.Item.reviews);
          return true;
        })
        .catch(err => {
          return false;
        });
    },
    getSingleBusiness(context, payload) {
      return axios
        .get(payload.url)
        .then(res => {
          context.commit("singleBusinessInfo", res.data.Item);
          return true;
        })
        .catch(err => {
          return false;
        });
    },
    getUserPic(context, payload) {
      let url = `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/getuserdetails/${
        payload.username
      }`;
      let token = payload.token;
      axios
        .get(url, { headers: { Authorization: token } })
        .then(res => {
          context.commit("updateUserPic", res.data.Item);
        })
        .catch(err => {
          return;
        });
    },

    changeDefaultToNewPic(context, payload) {
      let url = `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/update-user-details`;
      let token = payload.t;
      let myobj = {
        username: payload.u,
        userPhoto: payload.p
      };
      return axios
        .put(url, myobj, { headers: { Authorization: token } })
        .then(res => {
          return true;
          context.commit("DefaultToNewUserPic", res.data.Attributes);
        })
        .catch(err => {
          return false;
        });
    }
  }
});
