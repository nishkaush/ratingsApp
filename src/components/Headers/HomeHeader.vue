<template>
<v-container fluid :class="{headerfull:headColor}"> 
  <v-layout row>
    <v-flex xs12>

      <v-toolbar :class="{transparent:!headColor}" dark>
        <v-toolbar-side-icon 
        left class="hidden-md-and-up" 
        @click="sideNav=!sideNav"
        ></v-toolbar-side-icon>
        <v-toolbar-title style="cursor:pointer">
          <router-link to="/" tag="span">RatingsApp</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn 
          v-for="item in menu" 
          :key="item.title" 
          class="transparent elevation-0" 
          :to="item.link" 
          v-if="item.show===true" 
          @click.native="logout(item.title)">
          <v-icon left dark v-if="item.show===true">{{item.icon}}</v-icon> {{item.title}}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-navigation-drawer v-model="sideNav" absolute temporary>
        <v-list>
          <v-list-tile v-if="item.show===true" v-for="item in menu" :key="item.title" :to="item.link" @click="logout(item.title)">
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
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
export default {
  props: ["headColor"],
  data() {
    return {
      sideNav: false
    };
  },
  methods: {
    logout(title) {
      if (title === "Logout") {
        let userPool = new CognitoUserPool({
          UserPoolId: "ap-southeast-2_4hP69ss9p",
          ClientId: "64f654vu8d5vn5fgma9qjct1ha"
        });
        let cognitoUser = new CognitoUser({
          Username: userPool.getCurrentUser().getUsername(),
          Pool: userPool
        });
        cognitoUser.signOut();
        this.$store.dispatch("commitShowLoginSignup");
        this.$router.push({ path: "/" });
      }
    }
  },
  computed: {
    menu() {
      return this.$store.state.menu;
    }
  }
};
</script>


<style scoped>
.transparent {
  background: transparent;
}

.headerfull {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}
</style>
