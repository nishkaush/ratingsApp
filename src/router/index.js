import Vue from "vue"
import Router from "vue-router"
import Home from "@/components/Home"
import Login from "@/components/User/Login"
import Signup from "@/components/User/Signup"
import Profile from "@/components/User/Profile"
import SearchResults from "@/components/General/SearchResults"
import SingleBusiness from "@/components/General/SingleBusiness"

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile
    },
    {
      path: "/searchResults",
      name: "SearchResults",
      component: SearchResults
    },
    {
      path: "/singleBusiness",
      name: "SingleBusiness",
      component: SingleBusiness
    },
    {
      path: "*",
      name: "All",
      component: Home
    }
  ]
})
