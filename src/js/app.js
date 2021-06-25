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
  const LIMIT = 10;
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
            let artistName = item.name;
            let artistImages = item.images;
            let artistPopularity = item.popularity;
            let artistLink = item.external_urls.spotify;
            let artistFollowers = `${item.followers.total} подписчиков`;
            let artistsGenres = item.genres;

            const section = document.createElement("section");
            const link = document.createElement("a");
            const image = document.createElement("img");
            const h3 = document.createElement("h3");
            const ul = document.createElement("ul");
            const title = document.createElement("h2");
            const followers = document.createElement("span");

            image.src = artistImages[1].url;
            h3.textContent = "Жанровые теги";
            link.target = "_blank";
            link.href = artistLink;
            title.textContent = artistName;
            followers.textContent = artistFollowers;

            artistsGenres.forEach((genre) => {
              let artistGenre = genre;
              const li = document.createElement("li");
              li.textContent = artistGenre;
              ul.insertAdjacentElement("afterbegin", li);
              link.insertAdjacentElement("afterbegin", ul);
            });

            let fragment = document.createDocumentFragment();

            link.appendChild(image);
            if (artistsGenres.length != []) image.insertAdjacentElement("afterend", h3);
            link.insertAdjacentElement("afterbegin", title);
            section.insertAdjacentElement("afterbegin", link);
            link.appendChild(followers);
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
