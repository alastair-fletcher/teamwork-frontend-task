<template>
  <div class="planet-info">
    <ul>
      <li><span>Name: </span> {{ planetDetails.name }}</li>
      <li><span>Diameter: </span> {{ planetDetails.diameter }}</li>
      <li><span>Climate: </span> {{ planetDetails.climate }}</li>
      <li><span>Population: </span> {{ planetDetails.population }}</li>
    </ul>
    <button @click="closePlanetInfo()">X</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../Store';
import { storeToRefs } from 'pinia';
const store = useStore();
const { planetsArr, planetName, togglePlanetInfo } = storeToRefs(store);

//===== close 'planet info' popup
const closePlanetInfo = () => (togglePlanetInfo.value = false);

//===== get planet information for selected planet
const planetDetails = computed(() => {
  return planetsArr.value.find((planet) => planet.name === planetName.value);
});
</script>
