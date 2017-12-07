<template>
  <v-app class="bgimg">
    <v-container :fluid="isFluid">
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
import HomeHeader from "./components/Headers/HomeHeader.vue";
export default {
  data() {
    return {
      isFluid: false
    };
  },
  methods: {
    HideBgAndExpandHeader() {
      document.querySelector(".container").style.padding = "0";
      document.getElementById("app").style.backgroundImage = "none";
      this.isFluid = true;
      document
        .querySelector(".toolbar")
        .classList.add("grey", "darken-4", "elevation-15");
    },
    showBgAndShrinkHeader() {
      this.isFluid = false;
      document.getElementById("app").style.backgroundImage =
        "url('./src/assets/pancakes.jpeg')";
      document
        .querySelector(".toolbar")
        .classList.remove("elevation-15", "mt-1", "grey", "darken-4");
    }
  },
  components: {
    "home-header": HomeHeader
  },
  mounted() {
    if (this.$route.path !== "/") {
      this.HideBgAndExpandHeader();
    } else {
      this.showBgAndShrinkHeader();
    }
  },
  watch: {
    $route(to, from) {
      if (to.path !== "/") {
        this.HideBgAndExpandHeader();
      } else {
        this.showBgAndShrinkHeader();
      }
    }
  }
};
</script>


<style scoped>
.bgimg {
  /* background-image: url("./assets/pancakes.jpeg"); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
