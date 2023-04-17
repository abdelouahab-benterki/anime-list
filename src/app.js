const animesContainer = document.querySelector(".animes-container");

function createAnime(name, genre, ranking, img) {
  //creating card

  const animeCard = document.createElement("article");
  animeCard.classList.add("anime-card");

  //creating anime img

  const animeImgContainer = document.createElement("div");
  animeImgContainer.classList.add("w-full", "h-72");
  const animeImg = document.createElement("img");
  animeImg.src = img;
  animeImg.classList.add("w-full", "h-full");

  //anime infos

  const animeInfo = document.createElement("div");
  animeInfo.classList.add("p-4");
  const animeTitle = document.createElement("h2");
  animeTitle.classList.add(
    "text-xl",
    "font-bold",
    "mb-2",
    "max-w-prose",
    "overflow-hidden",
    "whitespace-nowrap",
    "text-ellipsis"
  );
  animeTitle.textContent = name;
  const animeGenre = document.createElement("p");
  animeGenre.classList.add(
    "text-sm",
    "font-medium",
    "mb-1",
    "max-w-prose",
    "overflow-hidden",
    "whitespace-nowrap",
    "text-ellipsis"
  );
  animeGenre.textContent = `Genre: ${genre.toString().trim()}`;
  const animeRanking = document.createElement("p");
  animeRanking.classList.add("text-sm", "font-medium");
  animeRanking.textContent = `Ranking: ${ranking}`;

  //appending all

  animeImgContainer.appendChild(animeImg);
  animeInfo.appendChild(animeTitle);
  animeInfo.appendChild(animeGenre);
  animeInfo.appendChild(animeRanking);
  animeCard.appendChild(animeImgContainer);
  animeCard.appendChild(animeInfo);

  return animeCard;
}

const getPageCount = async () => {
  const response = await fetch("https://api.jikan.moe/v4/anime");
  const animes = await response.json();
  const pageCount = animes.pagination.last_visible_page;
  return pageCount;
};

// render animes to main page

const renderAnimes = async (url) => {
  const response = await fetch(url);
  const animes = await response.json();
  const data = animes.data;
  data.forEach((anime) => {
    let id = anime.mal_id;
    let title = anime.title;
    let type = anime.type;
    let genres = anime.genres.map((genre) => genre.name);
    let rank = anime.rank;
    let img = anime.images.jpg.image_url;
    if (genres.includes("Hentai") || genres.includes("Ecchi")) {
      return;
    }
    let animeCard = createAnime(title, genres, rank, img);
    animesContainer.appendChild(animeCard);
  });
};

renderAnimes("https://api.jikan.moe/v4/top/anime");

// anime search

const searchField = document.querySelector(".search-field");
const searchBtn = document.querySelector(".search-btn");
const contentTitle = document.querySelector(".content-title");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let animeTitle = searchField.value.trim();

  if (animeTitle !== "") {
    animesContainer.textContent = "";
    let url = `https://api.jikan.moe/v4/anime?q=${animeTitle.replace(
      / /g,
      "%20"
    )}`;

    await renderAnimes(url);

    if (animesContainer.childElementCount === 0) {
      contentTitle.textContent = `No result was found for "${animeTitle}"`;
    } else {
      contentTitle.textContent = `Results for: "${animeTitle}"`;
    }
  }
});
