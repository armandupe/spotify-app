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
const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "91180e01ff8246128a88b889a7819be4";
const redirectUri = "http://localhost:8888/callback";
const scopes = ["user-top-read", "playlist-read-private"];

if (!TOKEN) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
}

const LIMIT = 10;
const TIME_RANGE = "long_term";
const URI = `https://api.spotify.com/v1/me/top/artists?time_range=${TIME_RANGE}&limit=${LIMIT}&offset=0`;
async function getPlaylistData() {
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
      response.items.forEach((track) => {
        track.track.artists.forEach((artist) => {
          console.log(artist.name);
        });
      });
    });
}

console.log(getPlaylistData());
