<template>
<v-container>
  <v-layout row v-if="!showContent">
    <v-flex>
      <div class="text-xs-center">
        <v-progress-circular indeterminate :size="80" color="blue darken-3" :width="7"></v-progress-circular>
      </div>
    </v-flex>
  </v-layout>
  
  <v-btn to="/searchResults"> <v-icon color="green">arrow_back</v-icon> Search Results</v-btn>

  <v-layout row v-if="showContent">
    <v-flex xs12 md10 offset-md1>
      <v-card>
        <v-card-media 
        :src="info.imageUrl" 
        height="300px"
        ></v-card-media>

        <v-card-text class="mt-2">
          <div class="text-xs-center">
            <h1>{{info.name | uppercase}}</h1>
            <h4>By {{info.owner | uppercase}}</h4>
            <p class="mt-2">More Info - {{info.description}}</p>
            <v-icon 
            v-for="(n,i) in 5" 
            :key="i"  
            :data-index="i"
            :class="{checked:i<averageRating?true:false}"
            large
            >star</v-icon> &nbsp;
          </div>
        </v-card-text>

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
          <div v-for="item in info.hours" :key="item.day" class="text-xs-center mb-1">
            <span class="body-2">{{item.day}} &nbsp;</span>
            <span>{{item.open}}am - </span>
            <span>{{item.close}}pm</span>
          </div>
        </v-card-text>

        <div class="text-xs-center mb-1 pb-3">
          <v-btn class="blue darken-3" dark large @click.native.stop="showReview">Write a Review</v-btn>
        </div>

        <v-snackbar
          multi-line vertical v-model="snackbar" top>
          Please login/signup to write a review
          <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>

        <v-dialog v-model="writeReview" max-width="600">
          <v-card class="pl-2 pr-2 pb-3">
            <v-icon 
            v-for="(n,i) in 5" 
            :key="i" 
            @click="rateStars" 
            :data-index="i"
            class="hoverStar pt-3"
            >star</v-icon>
            <v-text-field multi-line label="Type the review here.." v-model="reviewText"></v-text-field>
            <v-card-actions>
              <v-btn @click.prevent="submitReview" :loading="loadingIcon">Submit Review</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
    </v-flex>
  </v-layout>

  <v-layout row v-if="showContent">
    <past-reviews :reviews="info.reviews"></past-reviews>
  </v-layout>
</v-container>
</template>


<script>
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import axios from "axios";
import PastReviews from "./PastReviews.vue";
import WriteReview from "./WriteReview";
export default {
  data() {
    return {
      y: "top",
      x: null,
      mode: "",
      timeout: 6000,
      snackbar: false,
      // showContent: true,
      username: "",
      reviewText: "",
      token: "",
      showContent: false,
      starColor: "grey",
      loadingIcon: false,
      writeReview: false,
      ratingInReview: "",
      url: `https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/singleBusiness/${this
        .$route.params.busId}`
    };
  },
  methods: {
    checkLoggedIn() {
      let userPool = new CognitoUserPool({
        UserPoolId: "ap-southeast-2_4hP69ss9p",
        ClientId: "64f654vu8d5vn5fgma9qjct1ha"
      });
      let cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        this.username = cognitoUser.getUsername();
        return { user: cognitoUser, loggedIn: true };
      }
      return { loggedIn: false };
    },
    rateStars(event) {
      let iconsArr = [].slice.call(document.querySelectorAll(".hoverStar"));
      let currentIndex = event.target.dataset.index;
      this.ratingInReview = parseInt(currentIndex) + 1;
      if (currentIndex >= 0) {
        iconsArr.forEach(e => {
          if (e.dataset.index <= currentIndex) {
            e.classList.add("checked");
          } else {
            e.classList.remove("checked");
          }
        });
      }
    },
    submitReview() {
      let vm = this;
      vm.loadingIcon = true;
      let response = this.checkLoggedIn();
      if (response.loggedIn === true) {
        response.user.getSession((err, session) => {
          if (err) {
            return console.log(err);
          }
          this.token = session.getIdToken().getJwtToken();
          let payload = {
            rating: this.ratingInReview,
            businessID: this.$route.params.busId,
            reviewText: this.reviewText,
            userPhoto: "https://picsum.photos/700/400/?random",
            username: this.username,
            timestamp: Date.now()
          };
          this.$store
            .dispatch("addNewRating", {
              data: payload,
              token: vm.token
            })
            .then(res => {
              console.log("now shutting off the modal");
              if (res === true) {
                vm.loadingIcon = false;
                vm.writeReview = false;
              }
            });
        });
      } else {
        this.snackbar = !this.snackbar;
      }
    },
    showReview() {
      let response = this.checkLoggedIn();
      if (response.loggedIn === true) {
        this.writeReview = true;
      } else {
        this.snackbar = !this.snackbar;
      }
    }
  },
  computed: {
    info() {
      return this.$store.state.info;
    },
    averageRating() {
      if (this.info.reviews.length > 0) {
        let myArr = this.info.reviews.map(e => {
          return e.rating;
        });
        let mysum = myArr.reduce((a, b) => {
          return a + b;
        });
        return Math.round(mysum / this.info.reviews.length);
      } else {
        return 0;
      }
    }
  },
  created() {
    this.$store.dispatch("getSingleBusiness", { url: this.url }).then(res => {
      console.log(res);
      if (res === true) {
        return (this.showContent = true);
      }
      console.log("can't fetch stuff");
    });
  },
  components: {
    "past-reviews": PastReviews,
    "write-review": WriteReview
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


<style scoped>
.hoverStar:hover {
  cursor: pointer;
  color: #ffd732;
}
.theme--light .checked {
  color: #ffd732;
}
</style>
