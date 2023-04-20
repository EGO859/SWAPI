
const baseUrl = "https://swapi.dev/api",
      charactersList = document.getElementById("characters-list"),
      prevPageBtn = document.getElementById("prev-page-btn"),
      nextPageBtn = document.getElementById("next-page-btn"),
      characterDetailsTable = document.querySelector(".characters__table"),
      characterDetails = document.getElementById("character-details"),
      backToListBtn = document.getElementById("close-btn"),
      charactersFoto = document.getElementById("foto");

let currentPage = 1,
    characters = [];

prevPageBtn.addEventListener("click", () => {
  currentPage--;
  displayCharacters(currentPage);
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  displayCharacters(currentPage);
});

displayCharacters();

async function displayCharacters(page = 1) {

  let response = await fetch(`${baseUrl}/people/?page=${page}`),
      data = await response.json();
  characters = data.results;

  charactersList.innerHTML = "";
  characters.forEach((character) => {
    const listItem = document.createElement("li");
    listItem.textContent = character.name;
    charactersList.appendChild(listItem);

    listItem.addEventListener("click", () => {displayCharacterDetails(character)});    
  });

  if (currentPage === 1) {prevPageBtn.disabled = true;
  } else {prevPageBtn.disabled = false;}
  
  if (characters.length < 10) {nextPageBtn.disabled = true;
  } else { nextPageBtn.disabled = false;}
}

async function displayCharacterDetails(character) {  

  if (characterDetails.style.transform == "rotateY(0deg)") {
    characterDetails.style.transform = "rotateY(90deg)";
  }
  
  const homeworldResponse = await fetch(character.homeworld),
        homeworldData = await homeworldResponse.json(),
        homeworld = homeworldData.name;

  let species = "n/a";

  const films = await Promise.all(character.films.map(async (filmUrl) => {
      const response = await fetch(filmUrl),
            data = await response.json();
      return data.title;
    })
  );
  
  if (character.species.length > 0) {
    const speciesResponse = await fetch(character.species);
    const speciesData = await speciesResponse.json();
    species = speciesData.name;
  }

  const personResponse = await fetch(`https://starwars-visualguide.com/assets/img/characters/${character.url.split("/")[5]}.jpg`);
  const personImg = personResponse.ok ? `https://starwars-visualguide.com/assets/img/characters/${character.url.split("/")[5]}.jpg` : "https://via.placeholder.com/150";

  charactersFoto.innerHTML = `<img src="${personImg}" alt="${character.name}" height="280">`;
  characterDetailsTable.innerHTML = `
    <tbody>
      <tr>
        <td>Name</td>
        <td>${character.name}</td>
      </tr>
      <tr>
        <td>Year of birth</td>
        <td>${character.birth_year}</td>
      </tr>
      <tr>
        <td>Gender</td>
        <td>${character.gender}</td>
      </tr>
      <tr>
        <td>Movies</td>
        <td>${films.map((film) => `${film}`).join("</br>")}</td>
      </tr>
      <tr>
        <td>Home planet</td>
        <td>${homeworld}</td>
      </tr>
      <tr>
        <td>Subspecies</td>
        <td>${species}</td>
      </tr>  
    </tbody>`;

  characterDetails.style.transform = "rotateY(0deg)";

  backToListBtn.addEventListener("click", () => {characterDetails.style.transform = "rotateY(-90deg)";});
}


