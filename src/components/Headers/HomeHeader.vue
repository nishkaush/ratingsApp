<template>
<v-container fluid>
  <v-layout>
    <v-flex>
      <v-toolbar class="transparent" dark>
        <v-toolbar-side-icon left class="hidden-md-and-up" @click="sideNav=!sideNav"></v-toolbar-side-icon>
        <v-toolbar-title style="cursor:pointer" to="">
          <router-link to="/" tag="span">RatingsApp</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="item in menu" :key="item.title" class="transparent elevation-0" :to="item.link" v-if="item.show===true">
          <v-icon left dark v-if="item.show===true">{{item.icon}}</v-icon> {{item.title}}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-navigation-drawer v-model="sideNav" absolute temporary>
        <v-list>
          <v-list-tile v-for="item in menu" :key="item.title" :to="item.link">
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-flex>
  </v-layout>
</v-container>


  
</template>


<script>
export default {
  data() {
    return {
      sideNav: false
    }
  },
  computed: {
    menu() {
      return this.$store.state.menu
    }
  }
}
</script>
