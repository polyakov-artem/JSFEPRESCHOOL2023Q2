const KEY_USERS = "users";
const KEY_CARDS = "cards";

const defaultUserInfo = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  card: "",
  visits: 0,
  bonuses: 1240,
  books: [],
  cardIsPaid: false
};

export class Server {
  constructor() {
    this._bind();
  }

  _bind() {
    document.addEventListener("clientSubmit", this._clientSubmitHandler.bind(this));
  }

  _clientSubmitHandler(e) {
    const { type, signupData, authData, change, checkData } = e.detail;
    
    switch (type) {
      case "login":
        this._login(authData);
        break;
      case "check":
        this._check(checkData);
        break;
      case "signup":
        this._signup(signupData);
        break;
      case "change":
        this._change(authData, change);
        break;
      case "logout":
        this._dispatchResponseEvent({done: true, type: "logout", data: this._clone(defaultUserInfo)});
        break;
    }
  }


  _check(checkData = {}){
    const { firstName, card } = checkData;
    if (!firstName || !card) return;

    const users = this._getUsers();
    let email = null;

    for (let key in users) {
      if (users[key].card === card) {
        email = users[key].email;
        break;
      }
    };
    
    const userInfo = users[email];
    if (!userInfo || userInfo.firstName.toLowerCase() != firstName.toLowerCase()) return;

    this._dispatchResponseEvent({
      done: true,
      type: "check",
      data: {
        visits: userInfo.visits,
        bonuses: userInfo.bonuses,
        books: userInfo.books,
      },
    });
  }

  _login(authData = {}) {
    if (this._isHex(authData.email)) {
      authData.email = this._findUserEmail(authData.email);
    }
    const userInfo = this._getUserInfo(authData);
    if (!userInfo) {
      this._dispatchResponseEvent({done: false, type: "login", message: "Failed to login"});
      return;
    };

    userInfo.visits++;
    this._saveUserInfo(userInfo);
    this._dispatchResponseEvent({done: true, type: "login", data: userInfo });
  }

  _signup(signupData = {}) {
    const users = this._getUsers();
    const { firstName, lastName, email, password } = signupData;

    const response = {done: false, type: "signup"}

    if (!firstName || !lastName || !email || !password) {
      response.message = "Complete all fields"
      this._dispatchResponseEvent(response);
      return;
    };

    if (users[email]) {
      response.message = "This email already registered";
      this._dispatchResponseEvent(response);
      return;
    }

    const userInfo = Object.assign({}, this._clone(defaultUserInfo), signupData);
    userInfo.card = this._generateCard();
    this._saveCard(userInfo.card);
    this._saveUserInfo(userInfo);

    response.done = true;
    response.data =  {email: signupData.email, password: signupData.password};
    this._dispatchResponseEvent(response);

  }

  _change(authData = {}, change = {}) {
    const { type, key, value } = change;
    const userInfo = this._getUserInfo(authData);
    const response = {done: false, type: "change"}

    if (!userInfo || !(key in userInfo)) {
      response.message = "Failed to change data";
      this._dispatchResponseEvent(response);
      return;
    };

    switch (type) {
      case "add":
        userInfo[key].push(value);
        break;
      case "set":
        userInfo[key] = value;
        break;
      case "delete":
        userInfo[key] = userInfo[key].filter((val) => val !== value);
        break;
      default:
        response.message = "Set change type";
        this._dispatchResponseEvent(response);
        return;
    }

    this._saveUserInfo(userInfo);
    response.done = true;
    response.data = userInfo;
    // response.data = { key: value };
    this._dispatchResponseEvent(response);
  }

  _dispatchResponseEvent(eventData) {
    document.dispatchEvent(
      new CustomEvent("serverResponse", {
        detail: {
          done: eventData.done || false,
          data: eventData.data || null,
          type: eventData.type || "",
          message: eventData.message || "",
        },
      })
    );
  }

  _findUserEmail(card) {
    const users = this._getUsers();
    let email = null;

    for (let key in users) {
      if (users[key].card === card) {
        email = users[key].email;
        break;
      }
    }

    return email;
  }

  _saveCard(card) {
    const cards = this._getCards();
    cards[card] = "";
    this._setValue(KEY_CARDS, cards);
  }

  _saveUserInfo(userInfo) {
    const users = this._getUsers();
    users[userInfo.email] = userInfo;
    this._setValue(KEY_USERS, users);
  }

  _getUsers() {
    return this._getValue(KEY_USERS) || {};
  }

  _getCards() {
    return this._getValue(KEY_CARDS) || {};
  }

  _generateCard() {
    const cards = this._getCards();
    let card = this._generateCode(9);

    while (cards[card]) {
      card = this._generateCode();
    }
    return card;
  }

  _getUserInfo(authData) {
    const users = this._getUsers();

    if (this._isValidAuthData(authData)) {
      return users[authData.email];
    }
  }

  _isValidAuthData(authData = {}) {
    if (!authData.email || !authData.password) return false;
    const users = this._getUsers();

    return (
      authData.email in users &&
      users[authData.email].password === authData.password
    );
  }

  _getValue(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  _setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  _generateCode(length) {
    let hexCode = "";

    while (hexCode.length < length) {
      hexCode += Math.round(Math.random() * 15).toString(16);
    }
    return hexCode.toUpperCase();
  }

  _isHex(str) {
    return /^[A-F0-9]+$/i.test(str);
  }

  _clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }
}