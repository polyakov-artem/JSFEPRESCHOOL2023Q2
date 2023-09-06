const CLASS_MENU = "user-menu";
const CLASS_MENU_CONTENT = "user-menu__content";
const CLASS_MENU_TITLE = "user-menu__title";
const CLASS_MENU_TITLE_SMALL = "user-menu__title_sm";
const CLASS_MENU_LINK = "user-menu__link";
const CLASS_GUEST_AVATAR = "user-menu__guest-avatar";
const CLASS_USER_AVATAR = "user-menu__user-avatar";
const ATTRIBUTE_MODAL = "data-modal-id";
const VALUE_MODAL = "modal-profile";
const ATTRIBUTE_AUTH = "data-action";
const VALUE_LOGOUT = "logout";


export class UserMenu{
  constructor(){
    this._loggedIn = false;
    this._domUserMenu = null;
    this._domGuestMenu = document.querySelector(`.${CLASS_MENU}`).cloneNode(true);
    this._bindEvents();
  }

  _bindEvents(){
    document.addEventListener("login", this._loginHandler.bind(this))
    document.addEventListener("logout", this._logoutHandler.bind(this))
  }

  _logoutHandler(){
    this._loggedIn = false;
    this._domUserMenu = null;
    document.querySelector(`.${CLASS_MENU}`).replaceWith(this._domGuestMenu);
  }

  _loginHandler(e){
    const userInfo = e.detail;
    this._loggedIn = true;
    this._domUserMenu = this._createUserMenu(userInfo);
    document.querySelector(`.${CLASS_MENU}`).replaceWith(this._domUserMenu);
  }

  _createUserMenu(userInfo){
    const domUserMenu = this._domGuestMenu.cloneNode(true);

    const title = domUserMenu.querySelector(`.${CLASS_MENU_TITLE}`);
    title.textContent = userInfo.card;
    title.classList.add(CLASS_MENU_TITLE_SMALL);

    const domUserAvatar = document.createElement('div');
    domUserAvatar.textContent = `${userInfo.firstName.toUpperCase()[0]}${userInfo.lastName.toUpperCase()[0]}`;
    domUserAvatar.classList.add(CLASS_USER_AVATAR);
    domUserMenu.querySelector(`.${CLASS_GUEST_AVATAR}`).replaceWith(domUserAvatar);

    const links = domUserMenu.querySelectorAll(`.${CLASS_MENU_CONTENT} .${CLASS_MENU_LINK}`);
    links[0].textContent = "My profile";
    links[0].setAttribute(`${ATTRIBUTE_MODAL}`, `${VALUE_MODAL}`);

    links[1].textContent = "Log Out";
    links[1].setAttribute(`${ATTRIBUTE_AUTH}`, `${VALUE_LOGOUT}`);
    links[1].removeAttribute(`${ATTRIBUTE_MODAL}`);

    return domUserMenu;
  }
  
 }

