// format date and time
export function formatDateTime(dateISO) {
  const [date, time] = new Date(dateISO).toLocaleString().split(",");
  return [date, time];
}

// add 'cm' or 'kg' to data + remove annoying comma
export function formatHeightMass(heightMass, cmKg) {
  return heightMass === "unknown"
    ? heightMass
    : `${heightMass.replace(",", "")} ${cmKg}`;
}

// table heading names and keys
export const headingData = [
  { name: "Name", key: "name" },
  { name: "Height", key: "height" },
  { name: "Mass", key: "mass" },
  { name: "Created", key: "created" },
  { name: "Edited", key: "edited" },
  { name: "Planet", key: "planetName" },
];

// set key to sort data by, e.g. 'name', 'height' + toggle asc/desc (passing by ref)
export function setSortKey(key, sortKey, sortAscDesc, isActive) {
  sortAscDesc.value = !sortAscDesc.value;
  sortKey.value = key;
  isActive.value = key;
}

// set planet name to show popup with planet information
export function setPlanetName(planetInf, planetName) {
  planetInf !== "unknown"
    ? (planetName.value = planetInf)
    : (planetName.value = "");
}

// if sortKey is for 'mass' or 'height', separate 'unknown' and numeric values
export function separateUnknownAndNumericValues(column, people) {
  const unknown = [];
  const numeric = [];
  people.forEach((person) => {
    person[column] === "unknown" ? unknown.push(person) : numeric.push(person);
  });
  return [numeric, unknown];
}
