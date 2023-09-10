const KEY_AUTH_DATA = "authData"

export class AuthController {
  constructor() {
    const savedAuthData = this._getAuthData();
    this._bind();
    if (savedAuthData) this._login(savedAuthData)
  }

  _bind() {
    document.addEventListener("serverResponse", this._serverResponseHandler.bind(this));
    
  }

  _login(authData){
    document.dispatchEvent(new CustomEvent("clientSubmit", {detail: {type: "login", authData: authData}}))
  }

  _serverResponseHandler(e){
    const response = e.detail;
    if (!response.done) return;
    

    switch (response.type) {
      case "signup":
        this._login({
          email: response.data.email,
          password: response.data.password,
        });
        break;
      case "login":
        this.authData = {email: response.data.email, password: response.data.password};
        document.authController = this;
        if (!this._getAuthData()) this._saveAuthData(this.authData);
        break;

      case "logout":
        this.authData = null;
        this._deleteAuthData();
        break;
    }
  }

  _saveAuthData(authData) {
    this._setValue(KEY_AUTH_DATA, authData);
  }

  _deleteAuthData() {
    localStorage.removeItem(KEY_AUTH_DATA);
  }

  _getAuthData() {
    return this._getValue(KEY_AUTH_DATA);
  }

  _getValue(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  _setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}