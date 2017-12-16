import Vue from "vue";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.css";

import App from "./App";
import router from "./router";
import { store } from "./store/Store";
import AWS from "aws-sdk";

import { CognitoUserPool } from "amazon-cognito-identity-js";

Vue.use(Vuetify);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (
    to.name !== "Home" &&
    to.name !== "Login" &&
    to.name !== "Signup" &&
    to.name !== "SingleBusiness" &&
    to.name !== "SearchResults"
  ) {
    let userPool = new CognitoUserPool({
      UserPoolId: "ap-southeast-2_4hP69ss9p",
      ClientId: "64f654vu8d5vn5fgma9qjct1ha"
    });

    if (userPool.getCurrentUser() === null) {
      next({ path: "/" });
    } else {
      userPool.getCurrentUser().getSession((err, session) => {
        if (err) {
          return next("/");
        }
        session.isValid() ? next() : next("/");
      });
    }
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
