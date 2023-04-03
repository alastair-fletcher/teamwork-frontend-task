import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStore = defineStore('store', () => {
  const peopleArr = ref([]);
  const planetsArr = ref([]);
  const loading = ref(false);
  const searchTerm = ref('');
  const sortKey = ref('');
  const sortAscDesc = ref(true);

  //===== FETCH 'PEOPLE' AND 'PLANET' DATA FROM SWAPI AND CACHE IN LOCAL STORAGE
  async function fetchAndSetAPIData(type, numOfPages, destPiniaArr) {
    loading.value = true;
    //===== push page endpoints to array
    let endpoints = [];
    for (let i = 1; i < numOfPages; i++) {
      endpoints.push(`https://swapi.dev/api/${type}/?page=${i}`);
    }
    //===== map over array and fetch data from endpoints
    try {
      const responses = await Promise.all(endpoints.map((url) => fetch(url)));
      const data = await Promise.all(
        responses.map((response) => response.json())
      );
      const flattenedData = data.map((page) => page.results).flat();
      //===== cache data to local storage
      localStorage.setItem(type, JSON.stringify(flattenedData));
      //===== get data from local storage and push to peopleArr in Pinia store
      const localStorageData = JSON.parse(localStorage.getItem(type));
      destPiniaArr.value.push(...localStorageData);
    } catch (error) {
      console.log(error);
    }
    loading.value = false;
  }

  return {
    peopleArr,
    planetsArr,
    loading,
    searchTerm,
    sortKey,
    sortAscDesc,
    fetchAndSetAPIData,
  };
});
