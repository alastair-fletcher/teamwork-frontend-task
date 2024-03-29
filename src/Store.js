import { defineStore } from "pinia";
import { ref } from "vue";
import { useSwapiTableLoader } from "./api/useSwapiTableLoader";

export const useStore = defineStore("store", () => {
  const peopleArr = ref([]);
  const planetsArr = ref([]);
  const loading = ref(false);
  const searchTerm = ref("");
  const sortKey = ref("");
  const planetName = ref("");
  const showPlanetInfo = ref(false);
  const sortAscDesc = ref(true);

  //===== fetch 'people' and 'planet' data from SWAPI, then cache in local storage
  async function fetchAndSetAPIData(type, numOfPages, destPiniaArr) {
    loading.value = true;
    const data = await useSwapiTableLoader(type, numOfPages);
    localStorage.setItem(type, JSON.stringify(data));
    const localStorageData = JSON.parse(localStorage.getItem(type));
    destPiniaArr.value.push(...localStorageData);
    loading.value = false;
  }

  return {
    peopleArr,
    planetsArr,
    loading,
    searchTerm,
    sortKey,
    planetName,
    showPlanetInfo,
    sortAscDesc,
    fetchAndSetAPIData,
  };
});
