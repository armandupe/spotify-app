const HASH = window.location.hash
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

const LIMIT = 10;
const TIME_RANGE = "long_term";
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
      console.log(response);
    });
}

console.log(getData());
