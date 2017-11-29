<template>
  <v-app class="bgimg">
    <v-container :class="{fluid:isFluid}">
      <v-layout row>
        <v-flex>
          <home-header></home-header>
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-container>

  </v-app>
</template>

<script>
import HomeHeader from "./components/Headers/HomeHeader.vue"
export default {
  data() {
    return {
      isFluid: false
    }
  },
  components: {
    "home-header": HomeHeader
  },
  updated() {
    if (this.$route.path !== "/") {
      this.isFluid = true
      document.querySelector(".container").style.padding = "0"
      document.getElementById("app").style.backgroundImage = "none"
      document
        .querySelector(".toolbar")
        .classList.add("grey", "darken-4", "elevation-15", "mt-1")
    } else {
      this.isFluid = false
      document.getElementById("app").style.backgroundImage =
        "url('./src/assets/pancakes.jpeg')"
      document
        .querySelector(".toolbar")
        .classList.remove("elevation-15", "mt-1", "grey", "darken-4")
    }
  }
}
</script>


<style scoped>
.bgimg {
  background-image: url("./assets/pancakes.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
