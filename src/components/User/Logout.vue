<template>
  <div>
    <h1>Logout from here</h1>
  </div>
</template>

<script>
export default {
  beforeMount() {
    this.$router.push({ path: "/" });
  }
};
</script>
