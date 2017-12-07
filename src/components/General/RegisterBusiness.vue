<template>
<v-container class="mt-5">
  <v-layout row>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2>

      <v-form id="form">
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
          <img :src="imageUrl" height="200" v-if="imageUrl">
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
          <v-btn dark large class="blue darken-3" @click.prevent="submitForm" :disabled="showSubmitBtn">Submit</v-btn>
          <v-btn dark large class="blue darken-3" @click="resetForm">Clear Form</v-btn>
        </div>
        
      </v-form>

    </v-flex>
  </v-layout>
</v-container>
</template>


<script>
export default {
  data() {
    return {
      fullImage: "",
      imageUrl: "",
      uploadedFileName: "",
      inputRules: [val => (!!val ? true : "Required")],
      categories: ["Bars", "Restaurants", "Takeaway", "Clubs", "Other"],
      times: [],
      businessInfo: {
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
    submitForm() {
      console.log(this.businessInfo);
    },
    resetForm() {
      console.log("clicked");
      document.getElementById("form").reset();
    },
    onPickFile() {
      this.$refs.uglyInputBtn.click();
    },
    onFilePicked(e) {
      const file = event.target.files;
      //file is an array of files
      //in our case of single file, we can access it as file[0]
      //lets store it first for later upload
      this.fullImage = file[0];
      this.uploadedFileName = file[0].name;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      //the following task could take few seconds
      //we have installed event listener above to wait for it
      //once it finishes, it returns value in a "result" attr
      //which is a base64 url encoded string which acts as src for our image
      fileReader.readAsDataURL(file[0]);
    }
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
            console.log("first if is running");
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
