<template>
<v-container class="mt-5">
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
      <v-alert 
      outline color="error" 
      icon="warning" 
      v-model="alert" 
      transition="slide-y-transition"
      >{{alertText}}
      </v-alert>
    </v-flex>
  </v-layout>

  <v-layout row>
    <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
      <v-text-field 
      name="username" 
      label="username" 
      :rules="usernameRules"
      required v-model="signupData.username"
      ></v-text-field>

      <v-text-field 
      name="email" 
      label="email"
      :rules="emailRules"
      type="email" 
      required v-model="signupData.email"
      ></v-text-field>

      <v-text-field 
      name="password" 
      label="password" 
      :rules="passwordRules"
      type="password" 
      required v-model="signupData.password"
      ></v-text-field>

      <v-btn 
      block large dark 
      class="mt-4 blue darken-3" 
      @click="signup" 
      :loading="loadingIcon" 
      :disabled="showSubmitButton"
      >Signup</v-btn>
    </v-flex>
  </v-layout>

</v-container>
</template>


<script>
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";

export default {
  data() {
    return {
      loadingIcon: false,
      alert: false,
      alertText: "",
      signupData: {
        email: "",
        password: "",
        username: ""
      },
      usernameRules: [
        value => !!value || "Username is Required",
        value => {
          const pattern = /^\S*$/;
          return pattern.test(value) || "Username can't have spaces";
        }
      ],
      passwordRules: [
        value => !!value || "Password is Required",
        value =>
          value.length >= 8 || "Password must be atleast 8 characters long"
      ],
      emailRules: [
        value => !!value || "Email is Required",
        value => {
          const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      ]
    };
  },
  methods: {
    signup() {
      this.loadingIcon = true;
      let userPool = new CognitoUserPool({
        UserPoolId: "ap-southeast-2_4hP69ss9p",
        ClientId: "64f654vu8d5vn5fgma9qjct1ha"
      });

      let attributeEmail = new CognitoUserAttribute({
        Name: "email",
        Value: this.signupData.email
      });
      let attributeList = [attributeEmail]; //put attributes as objects into this array

      //signup the user and then log him in as well because cognito wont do it automatically
      userPool.signUp(
        this.signupData.username,
        this.signupData.password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            this.loadingIcon = false;
            this.alert = true;
            this.alertText = "Username or Email is already taken";
            return;
          }
          //now time to log the user in
          let vm = this;
          let cognitoUser = new CognitoUser({
            Username: this.signupData.username,
            Pool: userPool
          });

          let authencationDetails = new AuthenticationDetails({
            Username: this.signupData.username,
            Password: this.signupData.password
          });
          cognitoUser.authenticateUser(authencationDetails, {
            onSuccess(result) {
              vm.alert = false;
              vm.confirmText = true;
              let token = result.getIdToken().getJwtToken();
              vm.$store
                .dispatch("commitHideLoginSignup", {
                  u: vm.signupData.username,
                  e: vm.signupData.email,
                  p: "",
                  t: token
                })
                .then(res => {
                  if (res === true) {
                    vm.loadingIcon = false;
                    return vm.$router.push({ path: "/profile" });
                  }
                  vm.loadingIcon = false;
                });
            },
            onFailure(err) {
              vm.alert = true;
              vm.alertText = "Couldn't get you access, try again later";
            }
          });
        }
      ); // *** AWS signup function ends here****
    } //signup method ends here
  },
  computed: {
    showSubmitButton() {
      const pattern1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let a = pattern1.test(this.signupData.email);

      const pattern2 = /^\S*$/;
      let b = pattern2.test(this.signupData.username);

      let c = this.signupData.password.length >= 8;

      if (a && b && c) {
        return false;
      }
      return true;
    }
  }
};
</script>


<style scoped>
.lol {
  border: 1px solid red;
}
</style>
