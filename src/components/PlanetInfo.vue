<script setup>
import { computed } from "vue";
import { useStore } from "../Store";
import { storeToRefs } from "pinia";
const store = useStore();
const { planetsArr, planetName, showPlanetInfo } = storeToRefs(store);

function closePlanetInfo() {
  showPlanetInfo.value = false;
}

const planetDetails = computed(() => {
  return planetsArr.value.find((planet) => planet.name === planetName.value);
});
</script>

<template>
  <div
    class="w-full flex items-center justify-between h-12 p-3 rounded-lg bg-emerald-300 text-emerald-800 animate-[fadeIn_1s_ease]"
  >
    <ul class="w-10/12 flex justify-between list-none">
      <li>
        <span class="font-bold mr-3">Name: </span> {{ planetDetails.name }}
      </li>
      <li>
        <span class="font-bold mr-3">Diameter: </span>
        {{ planetDetails.diameter }}
      </li>
      <li>
        <span class="font-bold mr-3">Climate: </span>
        {{ planetDetails.climate }}
      </li>
      <li>
        <span class="font-bold mr-3">Population: </span>
        {{ planetDetails.population }}
      </li>
    </ul>
    <button
      @click="closePlanetInfo()"
      class="font-bold cursor-pointer top-1.5 outline-none text-2xl"
    >
      X
    </button>
  </div>
</template>
