<template>
  <v-container>
    <v-layout>
      <v-flex>
        
        <v-dialog>
          <v-icon 
          v-for="(n,i) in 5" 
          :key="i" 
          @click="rateStars" 
          :data-index="i"
          class="hoverStar"
          >star</v-icon>
          <v-text-field multi-line label="Type the review here.."></v-text-field>
          <v-btn>Submit Review</v-btn>
        </v-dialog>
      
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      showReview: true
    };
  },
  methods: {
    rateStars(event) {
      let iconsArr = [].slice.call(document.querySelectorAll("i[data-index]"));
      let currentIndex = event.target.dataset.index;
      if (currentIndex >= 0) {
        iconsArr.forEach(e => {
          if (e.dataset.index <= currentIndex) {
            e.classList.add("checked");
          } else {
            e.classList.remove("checked");
          }
        });
      }
    }
  }
};
</script>
