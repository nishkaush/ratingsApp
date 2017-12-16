<template>
  <v-container>
    <v-snackbar :timeout="timeout" top v-model="snackbar">
      {{ snackBarText }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3 md8 offset-md2 text-xs-center>
        <v-avatar size="1" class="grey lighten-4">
          <img :src="uploadedImage" alt="avatar">
        </v-avatar>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-3">
      <v-flex xs12 md2 offset-md5>
        <input type="file" style="display:none" ref="uglyBtn" accept="image/*" @change="afterFilePicked">
        <v-btn :loading="loadIcon" large v-if="showUploadBtn" class="blue" dark @click="submitProfilePic">Upload&nbsp;<v-icon>cloud_queue</v-icon> </v-btn>
        <v-btn round @click="filePick">Choose Pic</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-5">
      <v-flex xs12 sm1 offset-sm5>
        <h3>Email</h3>
      </v-flex>
      <v-flex xs12 sm3>
        <span readonly>{{userEmail}}</span>
      </v-flex>
    </v-layout>

    <v-layout row class="mt-2">
      <v-flex xs12 sm1 offset-sm5>
        <h3>Username</h3>
      </v-flex>
      <v-flex xs12 sm3>
        <span readonly>{{userName}}</span>
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
import AWS from "aws-sdk";
export default {
  data() {
    return {
      timeout: 6000,
      fullImage: "",
      fullImageName: "",
      thumbnailURL: "",
      loadIcon: false,
      snackbar: false,
      snackBarText: "",
      showUploadBtn: false
    };
  },
  computed: {
    uploadedImage() {
      if (this.$store.state.userPhoto) {
        return this.$store.state.userPhoto;
      }
    },
    userName() {
      return this.$store.state.username;
    },
    userEmail() {
      return this.$store.state.userEmail;
    }
  },
  created() {
    this.snackbar = true;
    this.snackBarText = "Loading Your Details...";
    let userPool = new CognitoUserPool({
      UserPoolId: "ap-southeast-2_4hP69ss9p",
      ClientId: "64f654vu8d5vn5fgma9qjct1ha"
    });
    let cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
      let username = cognitoUser.getUsername();
      cognitoUser.getSession((err, session) => {
        if (err) {
          return this.$router.push({ path: "/" });
        }
        let token = session.getIdToken().getJwtToken();
        this.$store.dispatch("getUserPic", {
          username: username,
          token: token
        });
      });
    } else {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    filePick() {
      this.$refs.uglyBtn.click();
    },
    afterFilePicked(event) {
      const file = event.target.files;
      this.fullImage = file[0];
      this.fullImageName = file[0].name;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        // this.uploadedImage = fileReader.result;
        //activate little thumbnail url here
        this.showUploadBtn = true;
      });
      fileReader.readAsDataURL(file[0]);
    },
    sendToSSS(session, username) {
      let vm = this;
      let s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        accessKeyId: "*****",
        secretAccessKey: "*****"
      });
      let params = {
        Bucket: "ratings-app-business-upload",
        Key: username + "-profile-pic",
        Body: vm.fullImage,
        ACL: "public-read",
        ContentType: "*"
      };
      return s3.upload(params, (err, data) => {
        if (err) {
          this.snackbar = true;
          this.snackBarText = "Couldn't Upload Pic. Please Try Later";
          this.loadIcon = false;
          return;
        }
        this.snackbar = true;
        this.snackBarText = "Pic Successfully Loaded";
        this.showUploadBtn = false;
        vm.sendToDDB(data.Location, session, username);
      });
    },
    sendToDDB(imageUrl, session, username) {
      let token = session.getIdToken().getJwtToken();
      this.$store
        .dispatch("changeDefaultToNewPic", {
          u: username,
          p: imageUrl,
          t: token
        })
        .then(res => {
          this.loadIcon = false;
        });
    },
    submitProfilePic() {
      let vm = this;
      vm.loadIcon = true;
      let userPool = new CognitoUserPool({
        UserPoolId: "ap-southeast-2_4hP69ss9p",
        ClientId: "64f654vu8d5vn5fgma9qjct1ha"
      });
      let cognitoUser = userPool.getCurrentUser();
      if (cognitoUser !== null) {
        let username = cognitoUser.getUsername();
        return cognitoUser.getSession((err, session) => {
          if (err) {
            this.snackbar = true;
            this.snackBarText = "No Active Session. Please Login Again.";
            return;
          }
          if (session.isValid() === true) {
            return vm.sendToSSS(session, username);
          }
          this.snackbar = true;
          this.snackBarText = "No Active Session. Please Login Again.";
          return;
        });
      }
      vm.$router.push({ path: "/" });
    }
  }
};
</script>


<style>

</style>
