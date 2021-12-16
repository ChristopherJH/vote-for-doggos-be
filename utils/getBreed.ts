export function getBreed(url: string): string[] {
  const cutFirst = url.replace("https://images.dog.ceo/breeds/", "").split("/");
  const unformattedBreed = cutFirst[0];
  let nameArr = [];
  let breed;
  if (unformattedBreed.includes("-")) {
    const breedArr = unformattedBreed.split("-");
    for (const str of breedArr) {
      nameArr.push(
        `${str.slice(0, 1).toUpperCase()}${str.slice(1, str.length)}`
      );
    }
    breed = `${nameArr[1]} ${nameArr[0]}`;
  } else {
    breed = `${unformattedBreed
      .slice(0, 1)
      .toUpperCase()}${unformattedBreed.slice(1, unformattedBreed.length)}`;
  }
  return [unformattedBreed, breed];
}
