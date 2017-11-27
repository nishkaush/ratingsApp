<template>
<v-toolbar class="transparent" dark>
  <v-toolbar-side-icon left class="hidden-sm-and-up"></v-toolbar-side-icon>
  <v-toolbar-title>RatingsApp</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-toolbar-items>
    <v-btn class="transparent elevation-0">Login</v-btn>
    <v-btn class="transparent elevation-0">Signup</v-btn>
    <v-btn class="transparent elevation-0">Third Link</v-btn>
  </v-toolbar-items>
</v-toolbar>
</template>


<script>
export default {
  data() {
    return {
      menu: [{}]
    }
  },
  mounted() {
    if (this.$route.name !== "Home" && this.$route.name !== "All") {
      document
        .querySelector(".toolbar")
        .classList.add("grey", "darken-4", "elevation-15", "mt-3")
    } else {
      document
        .querySelector(".toolbar")
        .classList.remove("elevation-15", "mt-3", "grey", "darken-4")
    }
  }
}
</script>
