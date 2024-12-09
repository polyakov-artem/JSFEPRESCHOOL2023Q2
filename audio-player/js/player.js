import {Range} from "./range.js"

const audio = [
  {
    author: "Beyonce",
    title: "Lemonade",
    src: "./assets/audio/Beyonce_-_Lemonade.mp3",
    img: "./assets/img/Beyonce_-_Lemonade.jpg",
  },
  {
    author: "Dua Lipa",
    title: "Dont start now",
    src: "./assets/audio/Dua_Lipa_-_Dont-start-now.mp3",
    img: "./assets/img/Dua_Lipa_-_Dont-start-now.jpeg",
  },
  {
    author: "Glass Animals",
    title: "Heat Waves",
    src: "./assets/audio/Glass_Animals_-_Heat_Waves.mp3",
    img: "./assets/img/Glass_Animals_-_Heat_Waves.jpg",
  },
  {
    author: "Gotye",
    title: "Somebody that i used to know",
    src: "./assets/audio/Gotye_-_Somebody_that_i_used_to_know.mp3",
    img: "./assets/img/Gotye_-_Somebody_that_i_used_to_know.jpg",
  },
  {
    author: "Harry Hudson",
    title: "Whenimma",
    src: "./assets/audio/Harry_Hudson_-_Whenimma.mp3",
    img: "./assets/img/Harry_Hudson_-_Whenimma.jpg",
  },
];

const defaultInfo = {
  author: "",
  title: " ",
  src: "",
  img: "",
  duration: "00:00"
};


export class Player {
  constructor(element) {
    this._domPlayer = element;
    this._domTimeBar = element.querySelector(".player__timebar .range__bar");
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

    this._timeUpdateListener = ((e) => {
      const time = this._playingAudio.currentTime;
      this._domTimeBar.value = Math.floor(time);
      this._domCurrentTime.textContent = this._getFormatedTime(time);
      this._rangeInstance.updateProgress();
    }).bind(this);

    this._adudioEndListener = ((e) => {
      this._removeAudioEndListener();
      if (this._repeatOne) {
        this._tryToPlay(this._trackIndex);
      } else {
        this._nextBtnHandler();
      }
    }).bind(this);

    this._rangeInstance = new Range(this._domTimeBar);
    this._bindEvents();
    this._updateStaticView();
    this._loadTracks();
  }

  _bindEvents() {
    this._domPlayer.addEventListener("click", this._clickHandler.bind(this));
    this._domTimeBar.addEventListener(
      "input",
      this._timebarClickHandler.bind(this)
    );
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

  _repeatBtnHandler() {
    if (this._repeatOne) {
      this._repeatOne = false;
      this._domRepeatBtn.classList.remove("player__btn_active");
    } else {
      this._repeatOne = true;
      this._domRepeatBtn.classList.add("player__btn_active");
    }
  }

  _nextBtnHandler() {
    this._stopHandler();
    this._setNextIndex(this._trackIndex + 1);
    this._tryToPlay();
  }

  _prevBtnHandler() {
    this._stopHandler();
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
    this._track.loaded.then(
      this._playHandler.bind(this),
      this._errorHandler.bind(this)
    );
  }

  _playHandler(audio) {
    this._playingAudio = audio;
    this._hideLoader();
    this._clearErrorMessage();
    this._setTimeBarMax();
    this._updateStaticView();
    this._setTimeUpdateListener();
    this._addAudioEndListener();
    this._play();
  }

  _errorHandler(errorMessage) {
    this._hideLoader();
    this._updateStaticView();
    this._showErrorMessage(errorMessage);
  }

  _stopHandler() {
    if (!this._playingAudio) return;
    this._pause();
    this._paused = false;
    this._playingAudio.currentTime = 0.0;
    this._domTimeBar.value = 0;
    this._rangeInstance.updateProgress();

    this._hideLoader();
    this._clearErrorMessage();
    this._updateStaticView();
    this._removeTimeUpdateListener();
    this._removeAudioEndListener();
    this._playingAudio = null;
  }

  _setTimeUpdateListener() {
    this._playingAudio.addEventListener("timeupdate", this._timeUpdateListener);
  }

  _removeTimeUpdateListener() {
    this._playingAudio.removeEventListener(
      "timeupdate",
      this._timeUpdateListener
    );
  }

  _addAudioEndListener() {
    this._playingAudio.addEventListener("ended", this._adudioEndListener);
  }

  _removeAudioEndListener() {
    this._playingAudio.removeEventListener("ended", this._adudioEndListener);
  }

  _timebarClickHandler(e) {
    if (!this._playingAudio) return;
    this._playingAudio.currentTime = this._domTimeBar.value;
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

  _updateStaticView() {
    let info = defaultInfo;

    if (this._playingAudio) {
      info = this._track;
    }

    const { img, title, author, duration } = info;
    this._domImg.setAttribute("src", `${img}`);
    this._domBackground.style = img? `background: url(${img}) no-repeat center / cover`: "";
    this._domTitle.textContent = title;
    this._domAuthor.textContent = author;
    this._domDuration.textContent = this._getFormatedTime(duration) || duration;
    this._domCurrentTime.textContent =
    this._getFormatedTime(duration) || duration;
  }

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

  _getCorrectIndex(trackIndex) {
    let correctIndex = trackIndex;

    if (trackIndex >= this._tracks.length) {
      correctIndex = 0;
    } else if (trackIndex < 0) {
      correctIndex = this._tracks.length - 1;
    }
    return correctIndex;
  }

  _getFormatedTime(seconds) {
    if (typeof seconds !== "number") return;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formatedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mins}:${formatedSecs}`;
  }

  _setTimeBarMax() {
    this._domTimeBar.max = Math.floor(this._playingAudio.duration);
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

