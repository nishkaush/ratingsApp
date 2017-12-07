<template>
<v-container>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <v-alert outline color="error" icon="warning" v-model="error">
        Invalid username or password, please try again!
      </v-alert>
    </v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3>
      <v-text-field
      name="username"
      label="Username or Email"
      :rules="userNameRules"
      v-model="username"
      required
      ></v-text-field>
    </v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3 md6 offset-md3>
      <v-text-field
      name="password"
      type="Password"
      label = "Password"
      required
      :rules="passwordRule"
      v-model="password"
      ></v-text-field>
    </v-flex>
  </v-layout>

  <v-layout>
    <v-flex xs12 sm6 offset-sm3 md4 offset-md4>
      <v-btn 
      large block dark
      @click.native="login" 
      :loading="loading"
      class="mt-2 blue darken-3"
      >Login
      </v-btn>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";

export default {
  data() {
    return {
      error: false,
      loading: false,
      username: "",
      password: "",
      passwordRule: [
        value => !!value || "password is Required",
        value =>
          value.length >= 8 || "Password must be atleast 8 characters long"
      ],
      userNameRules: [
        value => !!value || "Username or Email is Required",
        value => {
          const pattern = /^\S*$/;
          return pattern.test(value) || "Can't have spaces";
        }
      ]
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.error = false;
      let vm = this;
      let userPool = new CognitoUserPool({
        UserPoolId: "ap-southeast-2_4hP69ss9p",
        ClientId: "64f654vu8d5vn5fgma9qjct1ha"
      });
      let cognitoUser = new CognitoUser({
        Username: this.username,
        Pool: userPool
      });

      let authencationDetails = new AuthenticationDetails({
        Username: this.username,
        Password: this.password
      });
      cognitoUser.authenticateUser(authencationDetails, {
        onSuccess(result) {
          vm.loading = false;
          vm.error = false;
          vm.$store.dispatch("commitHideLoginSignup");
          vm.$router.push("/profile");
        },
        onFailure(err) {
          vm.error = true;
          vm.loading = false;
        }
      });
    }
  }
};
</script>
