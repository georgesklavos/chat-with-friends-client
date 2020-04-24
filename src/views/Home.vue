<template>
  <div class="home">
    <app-bar></app-bar>
    <h1>Home</h1>
  </div>
</template>

<script>
import appBar from "../components/appBar.vue";
export default {
  name: "Home",
  components: {
    appBar
  }
};
</script>
