<template>
<v-container class="mt-4" id="regBusContainer">
  <v-layout row>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2 v-if="!successPage">
      <v-form id="form" aria-autocomplete="off">
        <v-text-field label="Business Name" required v-model="businessInfo.name" :rules="inputRules"></v-text-field>
        <v-select  label="Choose a Business Type" :items="categories" v-model="businessInfo.type"></v-select>
        
        <div class="myFileUploadDiv text-xs-center">
          <v-btn 
          @click="onPickFile" round
          dark class="blue-grey lighten-1"
          >Upload Image</v-btn>
          <input 
          type="file" 
          style="display:none" 
          ref="uglyInputBtn" 
          accept="image/*"
          @change="onFilePicked">
          <span>{{uploadedFileName}}</span>
        </div>

        <div class="text-xs-center">
          <img :src="thumbnailUrl" height="200" v-if="thumbnailUrl">
        </div>

        <v-container fluid class="pl-0 pr-0">
          <v-layout row wrap>
            <v-flex xs12 sm6 md6>
              <v-text-field required id="autocomplete" label="Enter a location" v-model="businessInfo.location.street" :rules="inputRules"></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 offset-sm1 md5 offset-md1>
              <v-text-field label="City" required v-model="businessInfo.location.city" :rules="inputRules"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 md4>
              <v-text-field label="State" required v-model="businessInfo.location.state" :rules="inputRules"></v-text-field>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1 md4 offset-md1>
              <v-text-field label="Country" required v-model="businessInfo.location.country" :rules="inputRules"></v-text-field>
            </v-flex>
            <v-flex xs12 sm2 offset-sm1 md2 offset-md1>
              <v-text-field label="Postcode" required v-model="businessInfo.location.postcode" :rules="inputRules"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        
        <v-text-field label="Phone Number" mask="phone" v-model="businessInfo.phone" required :rules="inputRules"></v-text-field>
        <v-text-field label="Business Description" textarea v-model="businessInfo.description"></v-text-field>
        
        <v-container>
          <v-layout>
            <v-flex xs12>
              <h3 class="mb-3 text-xs-center">Operating Hours</h3>
            </v-flex>
          </v-layout>
          <v-layout row v-for="item in businessInfo.hours" :key="item.day">
            <v-flex xs1>
              <v-subheader>{{item.day}}</v-subheader>
            </v-flex>
            <v-flex xs3 offset-xs3>
              <v-select 
              label="Open" 
              :items="times | convertToTime" 
              v-model="item.open"
              ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs3>
            <v-select 
            label="Close" 
            :items="times | convertToTime" 
            v-model="item.close"
            ></v-select>
            </v-flex>
          </v-layout>
        </v-container>

        <div class="text-xs-center mt-4">        
          <v-btn 
          dark large 
          class="blue darken-3" 
          @click.prevent="submitForm" 
          :disabled="showSubmitBtn"
          :loading="loading"
          >Submit</v-btn>
          <v-btn dark large class="blue darken-3" @click="resetForm">Clear Form</v-btn>
        </div>

      </v-form>
    </v-flex>


    <v-flex v-else>
      <success-confirm :info="businessInfo"></success-confirm>
    </v-flex>
  </v-layout>

    <v-layout>
    <v-flex>
    <v-alert outline color="error" icon="warning" :value="errorMessage">
      {{errorMessage}}
    </v-alert>
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
import axios from "axios";
import SuccessConfirm from "./SuccessConfirm.vue";
import AWS from "aws-sdk";
import uuidv4 from "uuid/v4";

export default {
  data() {
    return {
      loading: false,
      errorMessage: "",
      thumbnailUrl: "",
      successPage: false,
      uploadedFileName: "",
      inputRules: [val => (!!val ? true : "Required")],
      categories: ["Bars", "Restaurants", "Takeaway", "Clubs", "Other"],
      times: [],
      businessInfo: {
        owner: "",
        businessID: "",
        fullImage: "",
        imageUrl: "",
        name: "",
        type: "",
        location: {
          street: "",
          city: "",
          state: "",
          country: "",
          postcode: ""
        },
        phone: "1234567890",
        description: "",
        ratings: [],
        hours: [
          { day: "Monday", open: "", close: "" },
          { day: "Tuesday", open: "", close: "" },
          { day: "Wednesday", open: "", close: "" },
          { day: "Thursday", open: "", close: "" },
          { day: "Friday", open: "", close: "" },
          { day: "Saturday", open: "", close: "" },
          { day: "Sunday", open: "", close: "" }
        ]
      }
    };
  },
  methods: {
    offToDDB(url, Id, session, username) {
      let vm = this;
      let token = session.getIdToken().getJwtToken();
      this.businessInfo.name = this.businessInfo.name.toUpperCase();
      this.businessInfo.owner = username;
      this.businessInfo.imageUrl = url;
      this.businessInfo.businessID = Id;

      let myLink =
        "https://4zp790teb4.execute-api.ap-southeast-2.amazonaws.com/dev/registerbusiness";
      axios
        .post(myLink, vm.businessInfo, {
          headers: { Authorization: token }
        })
        .then(res => {
          if (!res.data.errorMessage) {
            vm.loading = false;
            return (vm.successPage = true);
          }
          this.errorMessage = "Error while saving entry, Try later!";
        })
        .catch(err => {
          this.errorMessage = "Error in saving entry, Try again later!";
        });
    },

    submitForm() {
      let vm = this;
      vm.loading = true;
      let userPool = new CognitoUserPool({
        UserPoolId: "ap-southeast-2_4hP69ss9p",
        ClientId: "64f654vu8d5vn5fgma9qjct1ha"
      });
      let cognitoUser = userPool.getCurrentUser();
      if (cognitoUser !== null) {
        let username = cognitoUser.getUsername();
        return cognitoUser.getSession((err, session) => {
          if (err) {
            return (this.errorMessage =
              "No Active Session. Please Login Again.");
          }
          if (session.isValid() === true) {
            //check if fullimage even exists or not
            if (vm.businessInfo.fullImage) {
              return vm.offToSSS(session, username);
            }
            return vm.offToDDB("", uuidv4(), session, username);
          }
          return (this.errorMessage = "No Active Session. Please Login Again!");
        });
      }
      return (this.errorMessage = "No Active Session. Please Login Again!");
    },

    offToSSS(session, username) {
      let vm = this;
      let s3 = new AWS.S3({
        apiVersion: "2006-03-01",
        accessKeyId: "*****",
        secretAccessKey: "****"
      });
      let params = {
        Bucket: "ratings-app-business-upload",
        Key: uuidv4(),
        Body: vm.businessInfo.fullImage,
        ACL: "public-read",
        ContentType: "*"
      };
      return s3.upload(params, (err, data) => {
        if (err) {
          this.errorMessage = "Error Uploading Image, Please Try later.";
          return;
        }
        vm.offToDDB(data.Location, data.Key, session, username);
      });
    },

    resetForm() {
      this.businessInfo.hours.forEach(r => {
        r.open = "";
        r.close = "";
      });
      for (var item in this.businessInfo) {
        if (item !== "location" && item !== "hours") {
          this.businessInfo[item] = "";
        } else if (item === "location") {
          for (var i in this.businessInfo.location) {
            this.businessInfo.location[i] = "";
          }
        }
      }
    },
    onPickFile() {
      this.$refs.uglyInputBtn.click();
    },
    onFilePicked(e) {
      //file is an array of files
      const file = event.target.files;
      this.businessInfo.fullImage = file[0];
      this.uploadedFileName = file[0].name;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.thumbnailUrl = fileReader.result;
      });
      fileReader.readAsDataURL(file[0]);
    }
  },
  components: {
    "success-confirm": SuccessConfirm
  },
  computed: {
    showSubmitBtn() {
      let flag = true;
      for (let i in this.businessInfo.location) {
        !this.businessInfo.location[i] ? (flag = false) : (flag = flag);
      }
      if (this.businessInfo.name && flag && this.businessInfo.phone) {
        return false;
      }
      return true;
    }
  },
  filters: {
    convertToTime(value) {
      return value.map(e => {
        return `${e}:00`;
      });
    }
  },
  created() {
    let arr = [];
    let vm = this;
    addItems(-1);
    function addItems(flag) {
      arr.push(flag + 1);
      flag++;
      flag < 23 ? addItems(flag) : (vm.times = arr);
    }
  },
  mounted() {
    var autocomplete;
    let vm = this;
    function initAutocomplete() {
      autocomplete = new google.maps.places
        .Autocomplete(document.getElementById("autocomplete"), {
        types: ["geocode"]
      });
      //now listen for a change in value of input, so we show results
      autocomplete.addListener("place_changed", () => {
        var place = autocomplete.getPlace();
        vm.businessInfo.location.street = "";

        //beginning to derive info from google's response
        place.address_components.forEach(e => {
          if (e.types[0] === "street_number" || e.types[0] === "route") {
            let street = vm.businessInfo.location.street;
            street.length === 0
              ? (vm.businessInfo.location.street = e.long_name)
              : (vm.businessInfo.location.street += ` ${e.long_name}`);
          } else if (e.types[0] === "administrative_area_level_2") {
            vm.businessInfo.location.city = e.long_name;
          } else if (e.types[0] === "administrative_area_level_1") {
            vm.businessInfo.location.state = e.long_name;
          } else if (e.types[0] === "country") {
            vm.businessInfo.location.country = e.long_name;
          } else if (/postal_code/g.test(e.types[0])) {
            vm.businessInfo.location.postcode = e.long_name;
          }
        });
      });
    }
    initAutocomplete();
  }
};
</script>


<style scoped>
.myFileUploadDiv {
  margin: 2.5% auto 0 auto;
}
</style>
