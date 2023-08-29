<template>
  <v-card class="mx-4 mt-5 py-2 text-center" color="black" flat>
    <v-card-title class="mx-auto head">FOLDER STRUCTURE</v-card-title>
  </v-card>
  <div class="mt-5">
    <FolderStructure />
  </div>
</template>

<script setup>
import FolderStructure from "./FolderStructure.vue";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&display=swap");
.head {
  font-size: xx-large;
  font-family: "Playfair Display", serif;
}
</style>
