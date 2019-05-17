<template>
  <div id="app">
    <nav-bar/>
    <router-view/>
  </div>
</template>

<script>
import navBar from "@/components/navBar";
export default {
  components: {
    navBar
  }
};
</script>

<style>
.pointer:hover {
  cursor: pointer;
text-shadow: 0px 0px 3px rgb(212, 212, 212);
}
</style>
