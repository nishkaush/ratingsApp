import Vue from "vue"

import Vuetify from "vuetify"
import "vuetify/dist/vuetify.css"

import App from "./App"
import router from "./router"
import { store } from "./store/Store"

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
})

// router.beforeEach((to, from, next) => {
//   console.log("current route is -->", to)
//   if (to.name !== "Home") {
//     this.isFluid = true
//     document.querySelector(".container").style.padding = "0"
//     document.getElementById("app").style.backgroundImage = "none"
//     console.log("Moved away from Home")
//     next()
//   } else {
//     document.getElementById("app").style.backgroundImage =
//       "url('./src/assets/pancakes.jpeg')"
//     console.log("Back at Home")
//     next()
//   }
// })
