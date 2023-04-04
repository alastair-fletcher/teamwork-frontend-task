<template>
  <!-- starry sky -->
  <div class="stars"></div>
  <div class="stars2"></div>
  <div class="stars3"></div>

  <!-- loading spinner -->
  <RadarSpinner
    :animation-duration="1500"
    :size="400"
    color="rgb(244, 252, 30)"
    class="loading"
    id="spinner"
    v-if="loading"
  />

  <div class="container" v-if="!loading">
    <!-- header with logos -->
    <header>
      <img
        alt="Teamwork logo"
        id="teamwork-logo"
        class="logo"
        src="./assets/teamwork.svg"
      />
      <span>made with Vue and Pinia</span>
      <img
        alt="Vue logo"
        class="logo"
        src="./assets/vue-logo.svg"
        width="40"
        height="40"
      />
      <img
        alt="Pinia logo"
        class="logo"
        src="./assets/pinia-logo.svg"
        width="40"
        height="40"
      />
    </header>

    <div class="starwars-logo">
      <img alt="starwars logo" src="./assets/starwars.png" height="160" />
    </div>

    <SWAPITable />

    <PlanetInfo v-if="togglePlanetInfo" />
  </div>
</template>

<script setup>
import { RadarSpinner } from 'epic-spinners';
import SWAPITable from './components/SWAPITable.vue';
import PlanetInfo from './components/PlanetInfo.vue';
import { useStore } from './Store';
import { storeToRefs } from 'pinia';
const store = useStore();

const { loading, togglePlanetInfo } = storeToRefs(store);
</script>
