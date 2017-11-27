<template>
  <v-app>
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
  mounted() {
    if (this.$route.name !== "Home" && this.$route.name !== "All") {
      this.isFluid = true
      document.querySelector(".container").style.padding = "0"
    } else {
      // let myIndex = Math.floor(Math.random() * 2)
      // console.log(myIndex, this.bgImg[myIndex])
      document.getElementById("app").style.backgroundImage =
        "url('./src/assets/pancakes.jpeg)"
      // document.getElementById("app").style.backgroundSize = "cover"
      // document.getElementById("app").style.backgroundPosition = "center"
      // document.getElementById("app").style.backgroundRepeat = "no-repeat"
    }
  }
}
</script>


<style scoped>
/* #app {
  background-image: url("./assets/pancakes.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
} */
</style>
