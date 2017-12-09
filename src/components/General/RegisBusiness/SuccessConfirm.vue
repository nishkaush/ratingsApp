<template>
  <v-container>
    <v-layout>
      <v-flex>
        <h3>Your business has been registered successfully!</h3>
      </v-flex>
      <v-flex>
        <span>{{info.name}}</span>
        <span>{{info.type}}</span>
        <span>{{info.description}}</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  props: ["info"]
};
</script>
