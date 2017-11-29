<template>
<v-container class="mt-5">
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
      <v-alert 
      outline color="error" 
      icon="warning" 
      v-model="alert" 
      transition="slide-y-transition"
      >Oops! Something went wrong while signing up, please try again!</v-alert>
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

      <v-btn block large dark class="mt-4 blue darken-3" @click="signup">Signup</v-btn>
    </v-flex>
  </v-layout>
</v-container>
</template>


<script>
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from "amazon-cognito-identity-js"
import { CognitoIdentityServiceProvider } from "aws-sdk"

export default {
  data() {
    return {
      alert: false,
      signupData: {
        email: "",
        password: "",
        username: ""
      },
      usernameRules: [
        value => !!value || "Username is Required"
        // value => {
        //   const pattern = /\p{L}\p{M}\p{S}\p{N}\p{P}/
        //   return (
        //     pattern.test(value) ||
        //     "Invalid username - can only be alphanumeric."
        //   )
        // }
      ],
      passwordRules: [
        value => !!value || "Password is Required",
        value =>
          value.length >= 8 || "Password must be atleast 8 characters long"
      ],
      emailRules: [
        value => !!value || "Email is Required",
        value => {
          const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || "Invalid e-mail."
        }
      ]
    }
  },
  methods: {
    signup() {
      if (
        this.signupData.email &&
        this.signupData.password &&
        this.signupData.username
      ) {
        let userPool = new CognitoUserPool({
          UserPoolId: "ap-southeast-2_I3SEJr7cx",
          ClientId: "5dkkqd8eamlb3me4m9e35s8gtu"
        })
        let attributeList = [] //put attributes as objects into this array

        let attributeEmail = new CognitoUserAttribute({
          Name: "email",
          Value: this.signupData.email
        })

        attributeList.push(attributeEmail)

        userPool.signUp(
          this.signupData.username,
          this.signupData.password,
          attributeList,
          null,
          (err, result) => {
            if (err) {
              console.log(err)
              return (this.alert = true)
            }
            console.log("result of signup is-->", result)
            this.$store.dispatch("commitHideLoginSignup");
          }
        )
        // ***signup function ends here****
      }
    } //signup method ends here
  }
}
</script>


<style scoped>
.lol {
  border: 1px solid red;
}
</style>
