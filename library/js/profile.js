import { Copy } from "./copy.js";

const SELECTOR_NAME = ".profile-block__name"
const SELECTOR_AVATAR = ".profile-block__avatar"
const SELECTOR_VISITS_COUNTER = ".profile-block__item-visits .info-item__counter"
const SELECTOR_BONUSES_COUNTER = ".profile-block__item-bonuses .info-item__counter"
const SELECTOR_BOOKS_COUNTER = ".profile-block__item-books .info-item__counter"
const SELECTOR_CARD = ".profile-block__card-number"
const CLASS_BOOKS = "profile-block__list"
const CLASS_BOOKS_ITEM = "profile-block__list-item";
const SELECTOR_COPY = ".copy";


export class Profile {
  constructor(element) {
    this._domProfile = element;
    this._domName = element.querySelector(SELECTOR_NAME);
    this._domAvatar = element.querySelector(SELECTOR_AVATAR);
    this._domVisitsCounter = element.querySelector(SELECTOR_VISITS_COUNTER);
    this._domBonusesCounter = element.querySelector(SELECTOR_BONUSES_COUNTER);
    this._domBooksCounter = element.querySelector(SELECTOR_BOOKS_COUNTER);
    this._domCard = element.querySelector(SELECTOR_CARD);

    this._bindEvents();
    this._init();
  }

  _bindEvents() {
    document.addEventListener("serverResponse", this._serverResponseHandler.bind(this));
  }
  
  _init(){
    new Copy(this._domProfile.querySelector(SELECTOR_COPY), this._domCard);
  }

  _serverResponseHandler(e) {
    const response = e.detail;
    if(!response.done) return;

    switch (response.type) {
      case "login":
      case "change":
      case "logout":
        this._updateView(response.data);
        break;
    }
  }

  _updateView(userInfo) {
    for (let key in userInfo) {
      switch (key) {
        case "firstName":
        case "lasName":
          this._domName.textContent = `${userInfo.firstName} ${userInfo.lastName}`;
          this._domAvatar.textContent = `${userInfo.firstName[0]}${userInfo.lastName[0]}`;
          break;
        case "card":
          this._domCard.textContent = `${userInfo.card}`;
          break;
        case "visits":
          this._domVisitsCounter.textContent = `${userInfo.visits}`;
          break;
        case "bonuses":
          this._domBonusesCounter.textContent = `${userInfo.bonuses}`;
          break;
        case "books":
          const books = userInfo.books;
          this._domBooksCounter.textContent = `${books.length}`;
          this._updateBooksList(books);
          break;
      }
    }
  }

  _updateBooksList(books) {
    const domBooks = this._domProfile.querySelector(`.${CLASS_BOOKS}`);
    const updatedDomBooks = document.createElement("ul");
    updatedDomBooks.classList.add(CLASS_BOOKS);

    for (let item of books) {
      const domElement = document.createElement("li");
      domElement.classList.add(CLASS_BOOKS_ITEM);
      domElement.textContent = `${item.slice(1).join(", ")}`;
      updatedDomBooks.append(domElement);
    }

    domBooks.replaceWith(updatedDomBooks);
  }
}

