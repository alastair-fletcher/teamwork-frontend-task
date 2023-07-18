<script setup>
import LoadingSpinner from "./components/LoadingSpinner.vue";
import SWAPITable from "./components/SWAPITable.vue";
import PlanetInfo from "./components/PlanetInfo.vue";
import { useStore } from "./Store";
import { storeToRefs } from "pinia";
const store = useStore();

const { loading, togglePlanetInfo } = storeToRefs(store);
</script>

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
    class="mx-auto my-40"
    v-if="loading"
  />

  <div
    class="h-screen relative w-9/12 flex flex-col mx-auto mt-[8em] animate-[fadeIn_1s_ease]"
    v-if="!loading"
  >
    <div class="self-end flex absolute top-[-4em] right-[-1.5em] z-10">
      <div class="flex items-center self-end">
        <img
          alt="Teamwork logo"
          src="./assets/teamwork.svg"
          class="flex justify-center ml-4 rounded-lg h-8 bg-slate-100"
        />
        <img
          alt="Vue logo"
          src="./assets/vue-logo.svg"
          width="32"
          height="32"
          class="ml-4"
        />
        <img
          alt="Pinia logo"
          src="./assets/pinia-logo.svg"
          width="32"
          height="32"
          class="ml-4"
        />
      </div>
      <img alt="Starwars logo" src="./assets/starwars.png" class="w-80" />
    </div>
    <!-- footer with logos -->

    <!-- search and table -->
    <SWAPITable />
    <PlanetInfo v-if="togglePlanetInfo" />
  </div>
</template>

<script setup>
import { RadarSpinner } from "epic-spinners";
import SWAPITable from "./components/SWAPITable.vue";
import PlanetInfo from "./components/PlanetInfo.vue";
import { useStore } from "./Store";
import { storeToRefs } from "pinia";
const store = useStore();

const { loading, togglePlanetInfo } = storeToRefs(store);
</script>

<style lang="scss">
@import "./styles/variables";

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  background: linear-gradient(to top left, #121019 0%, #201194 100%);
  font-family: "Inter", sans-serif;
  color: rgb(51 65 85);
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

//========= create starry sky
@function create-stars($n) {
  $stars: "#{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF";

  @for $i from 2 through $n {
    $stars: "#{$stars} , #{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF";
  }
  @return unquote($stars);
}
@mixin star-template($numStars, $starSize) {
  background: transparent;
  border-radius: 50%;
  box-shadow: create-stars($numStars);
  height: $starSize;
  width: $starSize;
  z-index: 10;
}
.stars {
  @include star-template($numStarOneStars, 1px);
}
.stars2 {
  @include star-template($numStarTwoStars, 2px);
}
.stars3 {
  @include star-template($numStarThreeStars, 3px);
}
</style>
