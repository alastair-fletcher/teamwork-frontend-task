export async function useSwapiTableLoader(type, numOfPages) {
  let endpoints = [];
  for (let i = 1; i < numOfPages; i++) {
    endpoints.push(`https://swapi.dev/api/${type}/?page=${i}`);
  }

  try {
    const responses = await Promise.all(endpoints.map((url) => fetch(url)));
    const data = await Promise.all(
      responses.map((response) => response.json())
    );
    return data.map((page) => page.results).flat();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
