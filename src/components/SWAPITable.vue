<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "../Store";
import { storeToRefs } from "pinia";
const store = useStore();
const { fetchAndSetAPIData } = store;
const {
  peopleArr,
  planetsArr,
  searchTerm,
  sortKey,
  planetName,
  showPlanetInfo,
  sortAscDesc,
} = storeToRefs(store);

const isActive = ref("");

//========= table heading names and keys
const headingData = [
  { name: "Name", key: "name" },
  { name: "Height", key: "height" },
  { name: "Mass", key: "mass" },
  { name: "Created", key: "created" },
  { name: "Edited", key: "edited" },
  { name: "Planet", key: "planetName" },
];

//========= check if data is in local storage, if not fetch from API
onMounted(() => {
  const peopleData = localStorage.getItem("people");
  const planetsData = localStorage.getItem("planets");
  if (peopleData && planetsData) {
    peopleArr.value = JSON.parse(peopleData);
    planetsArr.value = JSON.parse(planetsData);
  } else {
    fetchAndSetAPIData("people", 10, peopleArr);
    fetchAndSetAPIData("planets", 7, planetsArr);
  }
});

//========= set key to sort data by, e.g. 'name', 'height' + toggle asc/desc
const setSortKey = (key) => {
  sortAscDesc.value = !sortAscDesc.value;
  sortKey.value = key;
  isActive.value = key;
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
        height: formatHeightMass(person.height, "cm"),
        mass: formatHeightMass(person.mass, "kg"),
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
    const isNumeric = ["mass", "height"].includes(sortKey.value);

    //========= if sortKey IS for 'mass' or 'height', separate 'unknown' and numeric values
    if (isNumeric) {
      const separateUnknownAndNumericValues = (column) => {
        const unknown = [];
        const numeric = [];
        filtered.forEach((person) => {
          person[column] === "unknown"
            ? unknown.push(person)
            : numeric.push(person);
        });
        return [numeric, unknown];
      };

      const [massNumerics, massUnknowns] =
        separateUnknownAndNumericValues("mass");
      const [heightNumerics, heightUnknowns] =
        separateUnknownAndNumericValues("height");

      //========= sort numerically and concatenate 'unknowns' to end
      const sortNumColumns = (columnType) => {
        return sortAscDesc.value
          ? columnType.sort(
              (a, b) =>
                Number(a[sortKey.value].split(" ")[0]) -
                Number(b[sortKey.value].split(" ")[0])
            )
          : columnType.sort(
              (a, b) =>
                Number(b[sortKey.value].split(" ")[0]) -
                Number(a[sortKey.value].split(" ")[0])
            );
      };
      return sortKey.value === "mass"
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
const formatDate = (date) => new Date(date).toLocaleString().split(",");

//========= add units to non 'unknown' data + remove annoying comma
const formatHeightMass = (data, unit) => {
  return data === "unknown" ? data : `${data.replace(",", "")} ${unit}`;
};

//========= set planet name to show popup with planet information
const setPlanetName = (planetInf) => {
  planetInf !== "unknown"
    ? (planetName.value = planetInf)
    : (planetName.value = "");
  togglePlanetInfo.value = true;
};
</script>

<template>
  <!-- search filter input -->
  <input
    type="search"
    class="w-1/3 rounded-full p-4"
    placeholder="Search by name or planet ..."
    v-model="searchTerm"
  />

  <!-- SWAPI table -->
  <div
    class="w-full overflow-auto my-8 max-h-[440px] rounded-lg scrollbar-rounded"
  >
    <table class="w-full bg-slate-50">
      <!-- table headings -->
      <thead class="sticky top-0 z-1">
        <tr class="hover:cursor-pointer">
          <th
            v-for="heading in headingData"
            :key="heading.key"
            class="bg-slate-200 p-3 hover:bg-slate-300"
            :class="{
              'column-active': heading.key === isActive,
            }"
            @click="setSortKey(heading.key)"
          >
            <div class="flex items-center">
              <span>{{ heading.name }}</span>
              <span
                class="ml-4"
                :class="{
                  'arrow-asc-desc': heading.key === isActive && !sortAscDesc,
                  'hide-arrow': heading.key !== isActive,
                }"
              >
                <svg
                  width="8px"
                  height="12px"
                  viewBox="0 0 8 12"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g stroke="none" stroke-width="1" fill="#3c55bd">
                    <path
                      d="M0.330789387,3.85823193 C0.477227032,3.98374992 0.714664757,3.98374992 0.861133655,3.85823193 L3.46876113,1.61015811 L3.46876113,11.6785709 C3.46876113,11.8560801 3.63666749,12 3.84376144,12 L4.15626176,12 C4.36335572,12 4.53126208,11.8560801 4.53126208,11.6785709 L4.53126208,1.61015811 L7.13888995,3.85823193 C7.28532759,3.98374992 7.52276506,3.98374992 7.66923396,3.85823193 L7.89017169,3.66882992 C8.03660933,3.54331192 8.03660933,3.33979402 7.89017169,3.21427603 L4.26516819,0.0941385001 C4.11873055,-0.0313794941 3.88129276,-0.0313794941 3.73482386,0.0941385001 L0.109851668,3.21427603 C-0.0366172294,3.33979402 -0.0366172294,3.54331192 0.109851668,3.66882992 L0.330789387,3.85823193 Z"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
          </th>
        </tr>
      </thead>

      <!-- table data -->
      <tbody>
        <tr
          v-for="person in filteredData"
          :key="person.url"
          class="hover:bg-emerald-100"
        >
          <td class="p-3 w-24">{{ person.name }}</td>
          <td class="p-3 w-24">{{ person.height }}</td>
          <td class="p-3 w-24">{{ person.mass }}</td>
          <td class="p-3 w-24">
            <div class="flex flex-col align-start">
              <span class="text-xs font-bold">{{
                formatDate(person.created)[0]
              }}</span>
              <span class="text-xs text-stone-400">{{
                formatDate(person.created)[1]
              }}</span>
            </div>
          </td>
          <td class="p-3 w-24">
            <div class="flex flex-col align-start">
              <span class="text-xs font-bold">{{
                formatDate(person.edited)[0]
              }}</span>
              <span class="text-xs text-stone-400">{{
                formatDate(person.edited)[1]
              }}</span>
            </div>
          </td>
          <td
            @click="setPlanetName(person.planetName)"
            class="hover:cursor-pointer hover:font-bold p-3 w-24"
          >
            {{ person.planetName }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.scrollbar-rounded::-webkit-scrollbar {
  width: 8px;
  border-top-right-radius: 0.5rem; /* 8px */
  border-bottom-right-radius: 0.5rem; /* 8px */
  background-color: rgb(248 250 252);
}

.scrollbar-rounded::-webkit-scrollbar-thumb {
  background-color: rgb(203 213 225);
  border-radius: 9999px;
}

.hide-arrow {
  visibility: hidden;
}

.arrow-asc-desc {
  transform: rotate(180deg);
}

.column-active {
  color: #3c55bd;
}
</style>
