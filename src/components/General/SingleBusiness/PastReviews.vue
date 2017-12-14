<template>

    <v-flex xs12 md10 offset-md1>
      <v-card class="pl-3">

        <v-card-title>
          <h1>Latest Reviews</h1>
        </v-card-title>
        <v-divider></v-divider>

       <v-card-text v-for="item in reviews" :key="item.username" class="">
         <v-avatar size="50px">
           <img :src="item.userPhoto">
         </v-avatar> &nbsp;
         <span class="subheading"><strong>{{item.username}}</strong></span>
         <v-spacer></v-spacer>
         <span class="pl-2 pt-0">
           <v-icon 
            v-for="(n,i) in 5" 
            :key="i" 
            :data-index="i"
            class="pt-2"
            :class="{checked:i<item.rating?true:false}"
            >star</v-icon>
          </span>
         <v-card-text>
           {{item.reviewText || "Not Available"}}
         </v-card-text>
         <v-card-text class="pt-0">{{item.timestamp | prettyTime}}</v-card-text>
         <v-divider></v-divider>
       </v-card-text>

      </v-card>
    </v-flex>

</template>

<script>
import moment from "moment";
export default {
  props: ["reviews"],
  filters: {
    prettyTime(value) {
      return moment(value).format("DD MMM YYYY");
    }
  }
};
</script>

<style scoped>
.theme--light .checked {
  color: #ffd732;
}
</style>
