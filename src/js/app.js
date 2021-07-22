import "../css/style.css";

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

const TOKEN = hash.access_token;
const AUTH_END_POINT = "https://accounts.spotify.com/authorize";

const CLIENT_ID = "91180e01ff8246128a88b889a7819be4";
const REDIRECT_URI = "http://localhost:8888/callback";
const SCOPES = ["user-top-read", "playlist-read-private"];

if (!TOKEN) {
  window.location = `${AUTH_END_POINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=token&show_dialog=true`;
}

const queryOptionsForm = document.querySelector(".queryOptionsForm");
queryOptionsForm.addEventListener("click", (e) => {
  const TIME_RANGE = e.target.value;
  const LIMIT = 30;
  const OFFSET = 0;
  const URI = `https://api.spotify.com/v1/me/top/artists?time_range=${TIME_RANGE}&limit=${LIMIT}&offset=${OFFSET}`;

  async function getData() {
    await fetch(`${URI}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (document.body.childNodes[8] === undefined) {
          const main = document.createElement("main");
          response.items.forEach((item) => {
            const artistName = item.name,
              artistImages = item.images,
              artistPopularity = item.popularity,
              artistLink = item.external_urls.spotify,
              artistFollowers = `${item.followers.total} подписчиков`,
              artistsGenres = item.genres,
              section = document.createElement("section"),
              link = document.createElement("a"),
              image = document.createElement("img"),
              ul = document.createElement("ul"),
              title = document.createElement("h2"),
              followers = document.createElement("p"),
              popularityTitle = document.createElement("h3"),
              popularity = document.createElement("div");

            image.src = artistImages[1].url;
            link.target = "_blank";
            link.href = artistLink;
            title.textContent = artistName;
            followers.textContent = artistFollowers;
            followers.classList.add("followers");
            popularityTitle.textContent = "Рейтинг популярности";
            popularity.classList.add("popularityBar");
            popularity.style.width = `${artistPopularity}%`;
            popularity.textContent = artistPopularity;
            if (artistPopularity >= 1 && artistPopularity <= 40) {
              popularity.classList.add("popularityBar__low");
            } else if (artistPopularity >= 40 && artistPopularity <= 65) {
              popularity.classList.add("popularityBar__medium");
            } else if (artistPopularity >= 66) {
              popularity.classList.add("popularityBar__high");
            }

            artistsGenres.forEach((genre) => {
              let artistGenre = genre;
              const li = document.createElement("li");
              li.textContent = artistGenre;
              ul.insertAdjacentElement("afterbegin", li);
              link.insertAdjacentElement("afterbegin", ul);
            });

            let fragment = document.createDocumentFragment();

            link.insertAdjacentElement("afterbegin", image);
            link.insertAdjacentElement("afterbegin", title);
            section.insertAdjacentElement("afterbegin", link);
            link.appendChild(followers);
            link.appendChild(popularityTitle);
            link.appendChild(popularity);
            main.insertAdjacentElement("afterbegin", section);

            fragment.appendChild(main);

            document.body.appendChild(fragment);
          });
        } else if (document.body.childNodes[8] !== undefined) {
          document.body.querySelector("main").remove();
        }
      });
  }

  getData();
});
