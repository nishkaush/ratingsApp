<template>
  <v-container fluid>

    <v-layout v-if="noResults">
      <v-flex xs12 sm10 offset-sm1 md6 offset-md3>
        <div class="text-xs-center mt-5">
          <h1>No Results Found</h1>
          <v-btn to="/" large dark class="mt-3 blue darken-3">Back to Home</v-btn>
        </div>
      </v-flex>
    </v-layout>

    <v-layout v-else v-for="item in searchResults" :key="item.businessID" class="mb-3">
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <v-card>
          
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs12 sm12 md4>
                <v-card-media :src="item.imageUrl" height="200"></v-card-media>
              </v-flex>

              <v-flex xs12 sm12 md7 offset-md1>
                <h2 class="mb-0 pb-0">{{item.name | uppercase}}</h2>
                <v-card-text class="subheader capitalize mt-0 pl-0">{{item.location.city}}</v-card-text>
                <v-icon 
                v-for="(n,i) in 5" 
                :key="i" 
                :data-index="i"
                :class="{checked:i<item.overallRating?true:false}"
                >star</v-icon>
                <v-card-text class="pl-0">{{item.description}}</v-card-text>
              </v-flex>
              
              <v-flex xs12 class="text-xs-right">
                <v-btn large dark @click="showSingleBusiness(item.businessID)" class="blue darken-3">Show More</v-btn>
              </v-flex>
                
              
              
            </v-layout>
          </v-container>


        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      noResults: ""
    };
  },
  methods: {
    showSingleBusiness(id) {
      this.$store.state.showResultsBtn = true;
      this.$router.push({ path: `/singleBusiness/${id}` });
    }
  },
  computed: {
    searchResults() {
      if (this.$store.state.searchResults.length > 0) {
        this.noResults = false;
        return this.$store.state.searchResults;
      } else {
        this.noResults = true;
      }
    }
  },
  filters: {
    uppercase(value) {
      return value.toUpperCase();
    }
  }
};
</script>


<style>
.subheader.capitalize {
  text-transform: capitalize;
  font-size: 1.2em;
}
.theme--light .checked {
  color: #ffd732;
}
</style>
