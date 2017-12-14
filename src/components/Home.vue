<template>
<v-container class="mt-5 pt-5">
  <v-layout row>
 
    <v-flex xs12 md12 lg10 offset-lg1>
      <v-card class="mt-5 pt-4 pb-4 reduceOpacity">
        <v-container>
          <v-layout row wrap>

          <v-flex xs12 md3 offset-md1>
            <v-select
            :items="category"
            label="Select Category"
            v-model="chosenCategory"
            dark
            class="title"
            ></v-select>
          </v-flex>

          <v-flex xs12 md3 offset-md1>
            <v-text-field dark :label="valueToSearchLabel" v-model="valueToSearch" class="title"></v-text-field>
          </v-flex>

          <v-flex xs12 md3 offset-md1>
            <v-btn large dark block class="mt-2 blue darken-3" @click.native.stop="search" :loading="loading" style="cursor:pointer">Search</v-btn>
          </v-flex>

          </v-layout>
        </v-container>
      </v-card>
    </v-flex>


  </v-layout>
</v-container>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      category: ["Name Of Business", "City"],
      chosenCategory: "",
      valueToSearch: "",
      loading: false
    };
  },
  methods: {
    axiosRequestFunc(url) {
      console.log(url);
      axios
        .get(url, { headers: { Authorization: "token" } })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      this.loading = true;
      if (!this.chosenCategory || !this.valueToSearch) {
        let myurl = `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/searchresults/all`;
        this.$store.dispatch("getSearchResults", { url: myurl }).then(res => {
          if (res === true) {
            this.loading = false;
            this.$router.push({ path: "/searchResults" });
          }
        });
      } else if (
        this.chosenCategory === "Name Of Business" &&
        this.valueToSearch
      ) {
        let myurl = `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/namesearch/${this.valueToSearch
          .split(" ")
          .join("-")}`;
        this.$store.dispatch("getSearchResults", { url: myurl }).then(res => {
          if (res === true) {
            this.loading = false;
            this.$router.push({ path: "/searchResults" });
          }
        });
      } else if (this.chosenCategory === "City" && this.valueToSearch) {
        let myurl = `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/citysearch/${this.valueToSearch
          .split(" ")
          .join("-")}`;
        this.$store.dispatch("getSearchResults", { url: myurl }).then(res => {
          if (res === true) {
            this.loading = false;
            this.$router.push({ path: "/searchResults" });
          }
        });
      }
    }
  },
  computed: {
    valueToSearchLabel() {
      if (this.chosenCategory === "Name") {
        return "Type the Name of Business";
      } else if (this.chosenCategory === "City") {
        return "Type the City Name";
      } else {
        return "Select a category first";
      }
    }
  }
};
</script>


<style scoped>
.card.reduceOpacity {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>
