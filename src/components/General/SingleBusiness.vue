<template>
<v-container>
  <v-layout row v-if="!showContent">
    <v-flex>
      <div class="text-xs-center">
        <v-progress-circular indeterminate :size="80" color="blue darken-3" :width="7"></v-progress-circular>
      </div>
    </v-flex>
  </v-layout>

  <v-layout row v-if="showContent">
    <v-flex xs12 md10 offset-md1>
      <v-card>
        <v-card-media 
        :src="info.imageUrl" 
        height="300px"
        ></v-card-media>

        <v-card-title class="mt-2">
          <div class="text-xs-center">
            <h1>{{info.name | uppercase}}</h1>
            <h4>By {{info.owner | uppercase}}</h4>
            <p class="mt-2">More Info - {{info.description}}</p>
            <v-icon color="purple lighten-1" v-for="(n,i) in 5" :key="i">star</v-icon>
          </div>
        </v-card-title>

        <v-card-text>
          <div class="text-xs-center">
            <h3> 
              <v-icon color="red">location_on</v-icon> 
              {{info.location.street}}, {{info.location.city}}, {{info.location.state | uppercase}}, {{info.location.country | uppercase}}, {{info.location.postcode}}
            </h3>
          </div>
          <div class="text-xs-center">
            <h3>
              <v-icon color="green">phone</v-icon> {{info.phone | formatNumber}}
            </h3>
          </div>
        </v-card-text>

        <v-card-text>
          <div v-for="item in info.hours" :key="item.day" class="text-xs-center">
            <span>{{item.day}}</span>
            <span>{{item.open}}</span>
            <span>{{item.close}}</span>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn class="blue darken-3" dark large>Write a Review</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row v-if="showContent">
    <past-reviews></past-reviews>
  </v-layout>
</v-container>
</template>


<script>
import axios from "axios";
import PastReviews from "./PastReviews.vue";
export default {
  data() {
    return {
      showContent: true,
      // showContent: false,
      url: `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/singleBusiness/${this
        .$route.params.busId}`
    };
  },
  computed: {
    info() {
      return this.$store.state.info;
    }
  },
  // mounted() {
  //   this.$store.dispatch("getSingleBusiness", { url: this.url }).then(res => {
  //     console.log(res);
  //     if (res === true) {
  //       this.showContent = true;
  //     }
  //   });
  // },
  // updated() {
  //   this.$store.dispatch("getSingleBusiness", { url: this.url }).then(res => {
  //     console.log(res);
  //     if (res === true) {
  //       this.showContent = true;
  //     }
  //   });
  // },
  components: {
    "past-reviews": PastReviews
  },
  filters: {
    uppercase(value) {
      return value.toUpperCase();
    },
    formatNumber(value) {
      var s2 = ("" + value).replace(/\D/g, "");
      var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
      return !m ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
    }
  }
};
</script>
