<template>
  <div>
    <h2>Welcome {{myprop}}!</h2>
  </div>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from "amazon-cognito-identity-js";

export default {
  data() {
    return {
      myprop: ""
    };
  },
  mounted() {
    let userPool = new CognitoUserPool({
      UserPoolId: "ap-southeast-2_4hP69ss9p",
      ClientId: "64f654vu8d5vn5fgma9qjct1ha"
    });
    //checking if user might have logged in via username password
    //if he logged in via fb or google, then we use info frm that
    if (userPool.getCurrentUser() === null) {
      if (FB.getAccessToken) {
        let userId = FB.getAuthResponse().userID;
        return FB.api(`/${userId}`, response => {
          if (response && !response.error) {
            return (this.myprop = response.name);
          }
          this.myprop = "FB APi response wasn't good";
        });
      }
      console.log("Profile page - Get login status != connected, redirecting");
      this.$router.push("/");
    } else {
      this.myprop = userPool.getCurrentUser().getUsername();
    }
  }
};
</script>
