const KEY_USERS = "users";
const KEY_CARDS = "cards";

const defaultUserInfo = {
  firstName: "", 
  lastName: "", 
  email: "",
  password: "",
  card: "",
  visits: 0,
  bonuses: 0,
  books: []
};

export class Server {

  signup(signupData = {}){
    const users = this._getUsers();
    const {firstName, lastName, email, password} = signupData;
    if (!firstName || !lastName || !email || !password) return {done: false, message: "Incomplete user data"};
    if (users[email]) return {done: false, message: "User already exists"};

    const userInfo = Object.assign({}, defaultUserInfo, signupData);
    userInfo.card = this._generateCard();

    this._saveCard(userInfo.card);
    this._saveUserInfo(userInfo);

    return {
      data: {
        email: signupData.email,
        password: signupData.password,
      },
    };
  }

  login(authData = {}){
    if (this._isHex(authData.email)) {
      authData.email = this._findUserEmail(authData.email)
    };
    const userInfo = this._getUserInfo(authData);
    if (!userInfo) return {done: false};

    userInfo.visits++;
    this._saveUserInfo(userInfo);

    return {done: true, data: userInfo};
  }

  changeUserData(authData = {}, change = {}){
    const {type, key, value} = change;
    const userInfo = this._getUserInfo(authData);
    if (!userInfo || !(key in userInfo)) return {done: false};

    switch (type) {
      case "add":
        userInfo[key].push(value)
        break;
      case "set":
        userInfo[key] = value;
        break;
      case "delete":
        userInfo[key] = userInfo[key].filter(val=> val !== value)
        break;
      default:
        return {done: false}
    };

    this._saveUserInfo(userInfo);
    return {done: true, data: userInfo};
  }

  _findUserEmail(card){
    const users = this._getUsers();
    let email = null;

    for (let key in users){
      if (users[key].card === card) email = users[key].email;
    };

    return email
  }

  _saveCard(card){
    const cards = this._getCards();
    cards[card] = "";
    this._setValue(KEY_CARDS, cards)
  }

  _saveUserInfo(userInfo){
    const users = this._getUsers();
    
    console.log(userInfo);
    users[userInfo.email] = userInfo;
    console.dir(users);
    this._setValue(KEY_USERS, users)
  }

  _getUsers(){
    return this._getValue(KEY_USERS) || {} 
  }

  _getCards(){
    return this._getValue(KEY_CARDS) || {}
  }

  _generateCard(){
    const cards = this._getCards();
    let card = this._generateCode(9);

    while (cards[card]) {
      card = this._generateCode()
    };
    return card
  }

  _getUserInfo(authData){
    const users = this._getUsers();

    if (this._isValidAuthData(authData)) {
      return users[authData.email]
    }
  }

  _isValidAuthData(authData = {}){
    if (!authData.email || !authData.password) return false;
    const users = this._getUsers();

    return (authData.email in users && users[authData.email].password === authData.password)
  }

  _getValue(key){
    const value = localStorage.getItem(key);
    return value? JSON.parse(value): null
  }

  _setValue(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  _generateCode(length){
    let hexCode = "";

    while (hexCode.length < length ) {
      hexCode += (Math.round(Math.random() * 15)).toString(16) 
    };
    return hexCode
  }

  _isHex(str){
    return /^[A-F0-9]+$/i.test(str)
  }

}