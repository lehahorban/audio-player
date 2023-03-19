const player = document.querySelector(".player");
const playBtn = document.querySelector(".play");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const audio = document.querySelector(".audio");
const progressContainer = document.querySelector(".progress_container");
const progress = document.querySelector(".progress");
const title = document.querySelector(".song");
const imgSrcPlay = document.querySelector(".img_src-play");
const imgSrcPause = document.querySelector(".img_src-pause");
const songTitle = document.querySelector(".song_title");
const durationItem = document.querySelector(".duration");

// Songs title
let songs = [];

// Get songs
// function getSongs() {
//   fetch("audio/")
//     .then((response) => response.text())
//     .then((data) => {
//       const parser = new DOMParser();
//       const htmlDoc = parser.parseFromString(data, "text/html");
//       const fileNames = Array.from(htmlDoc.querySelectorAll("a"))
//         .map((a) => a.href.split("/").pop())
//         .filter((name) => name.endsWith(".mp3"));

//       const songsArr = fileNames.map((name) =>
//         decodeURIComponent(name.replace(/\+/g, " ")).replace(".mp3", "")
//       );
//       console.log(songsArr);
//       songs = [...songsArr];
//       loadSong(songs[songIndex]);
//     })
//     .catch((error) => console.error(error));
// }
function getSongs() {
  fetch("audio/")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      const fileNames = Array.from(htmlDoc.querySelectorAll("a"))
        .map((a) => decodeURIComponent(a.href).split("/").pop())
        .filter((name) => name.endsWith(".mp3"));

      const songsArr = fileNames.map((name) => name.slice(0, -4));
      console.log(songsArr);
      songs = [...songsArr];
      loadSong(songs[songIndex]);
    })
    .catch((error) => console.error(error));
}

// Songs default
let songIndex = 0;
imgSrcPause.style.display = "none";

// Init
function loadSong(song) {
  title.innerHTML = song;
  audio.src = `audio/${song}.mp3`;
  songTitle.innerHTML = song;
}

// Play
function playSong(e) {
  player.classList.add("play");
  songTitle.classList.add("active");
  imgSrcPause.style.display = "block";
  imgSrcPlay.style.display = "none";
  audio.play();
}

// Pause
function pauseSong() {
  player.classList.remove("play");
  songTitle.classList.remove("active");
  imgSrcPause.style.display = "none";
  imgSrcPlay.style.display = "block";
  audio.pause();
}

playBtn.addEventListener("click", () => {
  const isPlaying = player.classList.contains("play");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Next song
function nextSong() {
  songIndex += 1;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

nextBtn.addEventListener("click", nextSong);

// Prev song
function prevSong() {
  songIndex -= 1;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

prevBtn.addEventListener("click", prevSong);

// Progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPersent = (currentTime / duration) * 100;
  progress.style.width = `${progressPersent}%`;
}

audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("timeupdate", () => {
  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);
  durationItem.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
});

// Set progress
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;

  playSong();
}

progressContainer.addEventListener("click", setProgress);

// Autoplay
audio.addEventListener("ended", nextSong);

getSongs();
