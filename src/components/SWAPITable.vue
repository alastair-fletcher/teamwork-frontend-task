<template>
  <!-- search filter input -->
  <input
    type="text"
    class="search-filter"
    placeholder="Search by name or planet ..."
    v-model="searchTerm"
  />

  <!-- SWAPI table -->
  <div class="swapi-table">
    <table>
      <!-- table headings -->
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

      <!-- table data -->
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
          <td @click="setPlanetName(person.planetName)" class="planet-column">
            {{ person.planetName }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from '../Store';
import { storeToRefs } from 'pinia';
const store = useStore();
const { fetchAndSetAPIData } = store;
const {
  peopleArr,
  planetsArr,
  searchTerm,
  sortKey,
  planetName,
  togglePlanetInfo,
  sortAscDesc,
} = storeToRefs(store);

//========= table heading names and keys
const headingData = [
  { name: 'Name', key: 'name' },
  { name: 'Height', key: 'height' },
  { name: 'Mass', key: 'mass' },
  { name: 'Created', key: 'created' },
  { name: 'Edited', key: 'edited' },
  { name: 'Planet', key: 'planetName' },
];

//========= check if data is in local storage, if not fetch from API
onMounted(() => {
  const peopleData = localStorage.getItem('people');
  const planetsData = localStorage.getItem('planets');
  if (peopleData && planetsData) {
    peopleArr.value = JSON.parse(peopleData);
    planetsArr.value = JSON.parse(planetsData);
  } else {
    fetchAndSetAPIData('people', 10, peopleArr);
    fetchAndSetAPIData('planets', 7, planetsArr);
  }
});

//========= set key to sort data by, e.g. 'name', 'height' + toggle asc/desc
const setSortKey = (key) => {
  sortAscDesc.value = !sortAscDesc.value;
  sortKey.value = key;
};

//========= make data filterable and sortable
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

    //========= check if sortKey refers to 'mass' or 'height' (for sorting numerically)
    const isNumeric = ['mass', 'height'].includes(sortKey.value);

    //========= if sortKey IS for 'mass' or 'height', separate 'unknown' and numeric values
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
      //========= OR, sort alphabetically
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

//========= format date and time + separate for CSS styling
const formatDate = (date) => new Date(date).toLocaleString().split(',');

//========= add units to non 'unknown' data + remove annoying comma
const formatHeightMass = (data, unit) => {
  return data === 'unknown' ? data : `${data.replace(',', '')} ${unit}`;
};

//========= set planet name to show popup with planet information
const setPlanetName = (planetInf) => {
  planetInf !== 'unknown'
    ? (planetName.value = planetInf)
    : (planetName.value = '');
  togglePlanetInfo.value = true;
};
</script>
