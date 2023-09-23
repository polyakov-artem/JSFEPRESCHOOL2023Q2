const audio = [
  {
    author: "Red Hot Chili Peppers",
    title: "Scar Tissue",
    src: "./assets/audio/Red_Hot_Chili_Peppers_-_Scar_Tissue.mp3",
    img: "./assets/img/1.jpg",
  },
  {
    author: "Король и шут",
    title: "Любовь и боль",
    src: "./assets/audio/КИШ_-_Любовь_и_боль.mp3",
    img: "./assets/img/2.jpg",
  },
  {
    author: "Король и шут",
    title: "Анархист",
    src: "./assets/audio/КИШ_-_Анархист.mp3",
    img: "./assets/img/3.jpeg",
  },
];

const defaultInfo = {
  author: "",
  title: "",
  src: "",
  img: "",
  duration: "--:--"
};


export class Player {
  constructor(element) {
    this._domPlayer = element;
    this._domTimeline = element.querySelector(".player__timeline");
    this._domDuration = element.querySelector(".player__duration");
    this._domCurrentTime = element.querySelector(".player__current-time");
    this._domImg = element.querySelector(".player__img");
    this._domBackground = element.querySelector(".player__background");
    this._domAuthor = element.querySelector(".player__author");
    this._domTitle = element.querySelector(".player__title");
    this._domMessage = element.querySelector(".player__message");
    this._domShuffleBtn = element.querySelector(".player__shuffle-btn");
    this._domRepeatBtn = element.querySelector(".player__repeat-btn");

    this._tracks = [...audio];
    this._track = this._tracks[0];
    this._trackIndex = 0;
    this._playingAudio = null;
    this._shuffled = false;
    this._repeatOne = false;

    this._playing = false;
    this._paused = false;

    this._bindEvents();
    this._loadTracks();
  }

  _bindEvents() {
    this._domPlayer.addEventListener("click", this._clickHandler.bind(this));
    // this._domTimeline.addEventListener("change", this._rangeHandler.bind(this));
  }

  _loadTracks() {
    this._tracks.forEach((track) => {
      const audio = new Audio();

      const loadingHandler = (resove, reject) => {
        audio.addEventListener("canplay", () => {
          resove(audio);
          track.duration = audio.duration;
        });

        audio.addEventListener("error", (e) => {
          reject("Track is not available");
        });
      };

      track.loaded = new Promise(loadingHandler);
      audio.src = track.src;
    });
  }

  _clickHandler(e) {
    const target = e.target;
    const shuffleBtn = target.closest(".player__shuffle-btn");
    const prevBtn = target.closest(".player__prev-btn");
    const playBtn = target.closest(".player__play-btn");
    const nextBtn = target.closest(".player__next-btn");
    const repeatBtn = target.closest(".player__repeat-btn");

    if (shuffleBtn) {
      this._shuffleBtnHandler();
      return;
    }

    if (prevBtn) {
      this._prevBtnHandler();
      return;
    }

    if (playBtn) {
      this._playBtnHandler();
      return;
    }

    if (nextBtn) {
      this._nextBtnHandler();
      return;
    }

    if (repeatBtn) {
      this._repeatBtnHandler();
      return;
    }
  }

  _shuffleBtnHandler() {
    if (this._shuffled) {
      this._tracks = [...audio];
      this._shuffled = false;
      this._domShuffleBtn.classList.remove("player__btn_active");
    } else {
      this._shuffleArray(this._tracks);
      this._shuffled = true;
      this._domShuffleBtn.classList.add("player__btn_active");
    }
  }

  _repeatBtnHandler(){
    if (this._repeatOne) {
      this._repeatOne = false;
      this._domRepeatBtn.classList.remove("player__btn_active");
    } else {
      this._repeatOne = true;
      this._domRepeatBtn.classList.add("player__btn_active");
    }

  }

  _nextBtnHandler() {
    this._stop();
    this._setNextIndex(this._trackIndex + 1);
    this._tryToPlay();
  }

  _prevBtnHandler() {
    this._stop();
    this._setNextIndex(this._trackIndex - 1);
    this._tryToPlay();
  }

  _playBtnHandler() {
    if (this._paused) {
      this._play();
      return;
    }

    if (this._playing) {
      this._pause();
      return;
    }

    this._tryToPlay(this._trackIndex);
  }

  _setNextIndex(index) {
    const correctIndex = this._getCorrectIndex(index);
    this._track = this._tracks[correctIndex];
    this._trackIndex = correctIndex;
  }

  _tryToPlay() {
    this._showLoader();

    this._track.loaded.then(playHandler.bind(this), errorHandler.bind(this));

    function playHandler(audio) {
      this._playingAudio = audio;
      this._hideLoader();
      this._clearErrorMessage();
      this._updateView(this._track);
      this._setTimelineMax();
      this._play(audio);
    }

    function errorHandler(errorMessage) {
      this._hideLoader();
      this._updateView(defaultInfo);
      this._showErrorMessage(errorMessage);
    }
  }

  _showLoader() {
    this._domPlayer.classList.add("player_loading");
  }
  _hideLoader() {
    this._domPlayer.classList.remove("player_loading");
  }

  _showErrorMessage(message) {
    this._domMessage.textContent = message;
    this._domPlayer.classList.add("player_error");
  }

  _clearErrorMessage() {
    this._domMessage.textContent = "";
    this._domPlayer.classList.remove("player_error");
  }

  _updateView(props) {
    const { img, title, author, duration } = props;
    this._domImg.setAttribute("src", `${img}`);
    this._domBackground.style = `background-image: url(${img})`;
    this._domTitle.textContent = title;
    this._domAuthor.textContent = author;
    this._domDuration.textContent = this._getFormatedDuration(duration);
  }

  _updateTime() {}

  _play() {
    this._playing = true;
    this._paused = false;
    this._domPlayer.classList.add("player_playing");
    this._playingAudio.play();
  }

  _pause() {
    this._playing = false;
    this._paused = true;
    this._domPlayer.classList.remove("player_playing");
    this._playingAudio.pause();
  }

  _stop() {
    if (!this._playingAudio) return;
    this._pause();
    this._paused = false;
    this._playingAudio.currentTime = 0.0;
    this._playingAudio = null;
  }

  _getCorrectIndex(trackIndex) {
    let correctIndex = trackIndex;

    if (trackIndex >= this._tracks.length) {
      correctIndex = 0;
    } else if (trackIndex < 0) {
      correctIndex = this._tracks.length - 1;
    }
    return correctIndex;
  }

  _getFormatedDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formatedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mins}:${formatedSecs}`;
  }

  _setTimelineMax() {
    this._domTimeline.max = Math.floor(this._track.duration);
  }

  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}

