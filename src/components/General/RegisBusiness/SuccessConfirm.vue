<template>
  <v-container>
    <v-layout row class="mb-2">
      <v-flex xs12>
        <div class="text-xs-center">
          <v-icon x-large dark color="light-green darken-2">check_box</v-icon>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-4">
      <v-flex xs8 offset-xs2>
        <div class="text-xs-center">
          <h2>{{info.name}} has been registered and saved successfully!</h2>
        </div>
        
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 md6 offset-md3>
        <div class="text-xs-center">
          <v-btn dark large block class="blue darken-3" @click="showSingleBusiness(info.businessID)">View the Registered Page</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  props: ["info"],
  methods: {
    showSingleBusiness(Id) {
      this.$router.push(`/singleBusiness/${Id}`);
    }
  }
};
</script>
