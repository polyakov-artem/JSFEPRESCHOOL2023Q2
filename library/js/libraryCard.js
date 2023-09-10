const CLASS_LIBRARY_CARD_GUEST = "library-card_guest"
const CLASS_LIBRARY_CARD_USER = "library-card_user"

const CLASS_GET_CARD_GUEST = "get-card_guest"
const CLASS_GET_CARD_USER = "get-card_user";

const CLASS_CARD_USER = "card_user"

const SELECTOR_BTN = ".card__btn";
const SELECTOR_CARD = ".card";
const SELECTOR_GET_CARD = ".get-card"
const SELECTOR_CARD_INPUT = ".card__number-input";
const SELECTOR_NAME_INPUT = ".card__name-input";
const SELECTOR_VISITS_COUNTER = ".card__item-visits .info-item__counter"
const SELECTOR_BONUSES_COUNTER = ".card__item-bonuses .info-item__counter"
const SELECTOR_BOOKS_COUNTER = ".card__item-books .info-item__counter"


export class LibraryCard {
  constructor(element) {
    this._libraryCard = element;
    this._getCard = element.querySelector(SELECTOR_GET_CARD);
    this._card = element.querySelector(SELECTOR_CARD);

    this._domName = element.querySelector(SELECTOR_NAME_INPUT);
    this._domCard = element.querySelector(SELECTOR_CARD_INPUT);

    this._domVisitsCounter = element.querySelector(SELECTOR_VISITS_COUNTER);
    this._domBonusesCounter = element.querySelector(SELECTOR_BONUSES_COUNTER);
    this._domBooksCounter = element.querySelector(SELECTOR_BOOKS_COUNTER);

    this._bindEvents();
  }

  _bindEvents() {
    document.addEventListener(
      "serverResponse",
      this._serverResponseHandler.bind(this)
    );
    this._libraryCard.addEventListener("click", this._btnHandler.bind(this));
  }

  _serverResponseHandler(e) {
    const response = e.detail;
    if (!response.done) return;

    switch (response.type) {
      case "login":
      case "change":
      case "logout":
        this._updateView(response.data);
        break;
    }
  }

  _updateView(userInfo) {
    const isLoggedIn = !!userInfo.email;

    if (isLoggedIn) {
      this._libraryCard.classList.remove(CLASS_LIBRARY_CARD_GUEST);
      this._getCard.classList.remove(CLASS_GET_CARD_GUEST);

      this._libraryCard.classList.add(CLASS_LIBRARY_CARD_USER);
      this._getCard.classList.add(CLASS_GET_CARD_USER);
      this._card.classList.add(CLASS_CARD_USER);
      
    } else {
      this._libraryCard.classList.add(CLASS_LIBRARY_CARD_GUEST);
      this._getCard.classList.add(CLASS_GET_CARD_GUEST);

      this._libraryCard.classList.remove(CLASS_LIBRARY_CARD_USER);
      this._getCard.classList.remove(CLASS_GET_CARD_USER);
      this._card.classList.remove(CLASS_CARD_USER);
    }



    for (let key in userInfo) {
      switch (key) {
        case "firstName":
        case "lasName":
          const text =  `${userInfo.firstName} ${userInfo.lastName}`.trim();;
          this._domName.value = text;
          break;
        case "card":
          this._domCard.value = `${userInfo.card}`;
          break;
        case "visits":
          this._domVisitsCounter.textContent = `${userInfo.visits}`;
          break;
        case "bonuses":
          this._domBonusesCounter.textContent = `${userInfo.bonuses}`;
          break;
        case "books":
          this._domBooksCounter.textContent = `${userInfo.books.length}`;
          break;
      }
    }
  }

  _btnHandler(e) {
    const btn = e.target.closest(SELECTOR_BTN);
    if (!btn) return;

    e.preventDefault();
  }
}
