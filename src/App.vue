<template>
  <!-- starry sky -->
  <div class="stars"></div>
  <div class="stars2"></div>
  <div class="stars3"></div>

  <!-- loading  spinner -->
  <RadarSpinner
    :animation-duration="1500"
    :size="400"
    color="rgb(244, 252, 30)"
    class="loading"
    id="spinner"
    v-if="loading"
  />

  <!-- main container -->
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

    <!-- search filter input -->
    <input
      type="text"
      class="search-filter"
      placeholder="Search by name or planet ..."
      v-model="searchTerm"
    />

    <!-- swapi table -->
    <div class="swapi-table">
      <table>
        <!-- swapi table headings -->
        <thead>
          <tr>
            <th
              v-for="heading in headingData"
              :key="heading.key"
              @click="setSortKey(heading.key)"
            >
              {{ heading.name }}
            </th>
          </tr>
        </thead>

        <!-- swapi table data -->
        <tbody>
          <tr v-for="person in filteredData" :key="person.url">
            <td>{{ person.name }}</td>
            <td>{{ person.height }}</td>
            <td>{{ person.mass }}</td>
            <td>
              <div class="created-edited-columns">
                <span class="format-date">{{
                  formatDate(person.created)[0]
                }}</span>
                <span class="format-time">{{
                  formatDate(person.created)[1]
                }}</span>
              </div>
            </td>
            <td>
              <div class="created-edited-columns">
                <span class="format-date">{{
                  formatDate(person.edited)[0]
                }}</span>
                <span class="format-time">{{
                  formatDate(person.edited)[1]
                }}</span>
              </div>
            </td>
            <td>
              {{ person.planetName }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { RadarSpinner } from 'epic-spinners';
import { useStore } from './Store';
import { storeToRefs } from 'pinia';
const store = useStore();
const { fetchAndSetAPIData } = store;
const { peopleArr, planetsArr, loading, searchTerm, sortKey, sortAscDesc } =
  storeToRefs(store);

onMounted(async () => {
  const peopleData = localStorage.getItem('people');
  const planetsData = localStorage.getItem('planets');
  if (peopleData && planetsData) {
    peopleArr.value = JSON.parse(peopleData);
    planetsArr.value = JSON.parse(planetsData);
  } else {
    await fetchAndSetAPIData('people', 10, peopleArr);
    await fetchAndSetAPIData('planets', 7, planetsArr);
  }
});

const setSortKey = (key) => {
  sortAscDesc.value = !sortAscDesc.value;
  sortKey.value = key;
};

//========= add units to non 'unknown' data + remove annoying comma
const formatHeightMass = (data, unit) => {
  return data === 'unknown' ? data : `${data.replace(',', '')} ${unit}`;
};

const formatDate = (date) => new Date(date).toLocaleString().split(',');

const headingData = [
  { name: 'Name', key: 'name' },
  { name: 'Height', key: 'height' },
  { name: 'Mass', key: 'mass' },
  { name: 'Created', key: 'created' },
  { name: 'Edited', key: 'edited' },
  { name: 'Planet', key: 'planetName' },
];

const filteredData = computed(() => {
  const filtered = peopleArr.value
    //========= get 'planet name' and add to person row
    .map((person) => {
      const planet = planetsArr.value.find(
        (planet) => planet.url === person.homeworld
      );
      return {
        ...person,
        height: formatHeightMass(person.height, 'cm'),
        mass: formatHeightMass(person.mass, 'kg'),
        planetName: planet.name,
      };
    })
    //========= filter data by 'name' or 'planet' based on search term
    .filter((person) => {
      return (
        person.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        person.planetName.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });
  //========= sort columns alphabetically / numerically
  const sorted = () => {
    //========= if no sortKey, return unsorted, filtered data
    if (!sortKey.value) {
      return filtered;
    }
    //========= check if sortKey refers to 'mass' or 'height'
    const isNumeric = ['mass', 'height'].includes(sortKey.value);
    //========= if sortKey is for 'mass' or 'height', separate 'unknown' and numeric values
    if (isNumeric) {
      const separateUnknownAndNumericValues = (column) => {
        const unknown = [];
        const numeric = [];
        filtered.forEach((person) => {
          person[column] === 'unknown'
            ? unknown.push(person)
            : numeric.push(person);
        });
        return [numeric, unknown];
      };

      const [massNumerics, massUnknowns] =
        separateUnknownAndNumericValues('mass');
      const [heightNumerics, heightUnknowns] =
        separateUnknownAndNumericValues('height');
      //========= sort numerically and concatenate 'unknowns' to end
      const sortNumColumns = (columnType) => {
        return sortAscDesc.value
          ? columnType.sort(
              (a, b) =>
                Number(a[sortKey.value].split(' ')[0]) -
                Number(b[sortKey.value].split(' ')[0])
            )
          : columnType.sort(
              (a, b) =>
                Number(b[sortKey.value].split(' ')[0]) -
                Number(a[sortKey.value].split(' ')[0])
            );
      };
      return sortKey.value === 'mass'
        ? sortNumColumns(massNumerics).concat(massUnknowns)
        : sortNumColumns(heightNumerics).concat(heightUnknowns);
    } else {
      return sortAscDesc.value
        ? filtered.sort((a, b) =>
            a[sortKey.value] > b[sortKey.value] ? 1 : -1
          )
        : filtered.sort((a, b) =>
            a[sortKey.value] < b[sortKey.value] ? 1 : -1
          );
    }
  };
  return sorted();
});
</script>
