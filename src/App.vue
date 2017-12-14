<template>
  <v-app :class="bgClass">

    <v-container :fluid="isFluid" class="pl-0 pr-0 pt-0">
      <v-layout row>
        <v-flex>
          <home-header :headColor="isFluid"></home-header>
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
      isFluid: false,
      bgClass: "bgimg"
    };
  },
  components: {
    "home-header": HomeHeader
  },
  mounted() {
    if (this.$route.path !== "/") {
      this.isFluid = true;
      this.bgClass = "nobg";
    } else {
      this.isFluid = false;
      this.bgClass = "bgimg";
    }
  },
  watch: {
    $route(to, from) {
      if (to.path !== "/") {
        this.isFluid = true;
        this.bgClass = "nobg";
      } else {
        this.isFluid = false;
        this.bgClass = "bgimg";
      }
    }
  }
};
</script>


<style scoped>
.bgimg {
  background-image: url("./assets/pancakes.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.nobg {
  background-image: none;
}
</style>
