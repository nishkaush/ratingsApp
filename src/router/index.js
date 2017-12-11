import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Login from "@/components/User/Login";
import Signup from "@/components/User/Signup";
import Logout from "@/components/User/Logout";
import Profile from "@/components/User/Profile";
import SearchResults from "@/components/General/SearchResults";
import SingleBusiness from "@/components/General/SingleBusiness";
import RegisterBusiness from "@/components/General/RegisBusiness/RegisterBusiness";

Vue.use(Router);

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
      path: "/logout",
      name: "Logout",
      component: Logout
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
      path: "/singleBusiness/:busId",
      name: "SingleBusiness",
      component: SingleBusiness
    },
    {
      path: "/registerBusiness",
      name: "RegisterBusiness",
      component: RegisterBusiness
    },
    {
      path: "*",
      name: "All",
      component: Home
    }
  ]
});
