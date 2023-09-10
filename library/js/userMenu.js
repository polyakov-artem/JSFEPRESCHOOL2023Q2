const CLASS_MENU = "user-menu";
const CLASS_MENU_CONTENT = "user-menu__content";
const CLASS_MENU_TITLE = "user-menu__title";
const CLASS_MENU_TITLE_SMALL = "user-menu__title_sm";
const CLASS_MENU_LINK = "user-menu__link";
const CLASS_GUEST_AVATAR = "user-menu__guest-avatar";
const CLASS_USER_AVATAR = "user-menu__user-avatar";
const ATTRIBUTE_MODAL = "data-modal-id";
const VALUE_MODAL = "modal-profile";
const ATTRIBUTE_LOGOUT = "data-action";
const VALUE_LOGOUT = "logout";


export class UserMenu {
  constructor() {
    this._guestMenu = document.querySelector(`.${CLASS_MENU}`).cloneNode(true);
    this._userMenu = this._createMenuTemplate();

    this._bindEvents();
  }
  
  _bindEvents() {
    document.addEventListener("serverResponse",this._serverResponseHandler.bind(this));
    document.addEventListener("click", this._logoutBtnHandler.bind(this));
  }

  _serverResponseHandler(e) {
    const response = e.detail;
    if (!response.done) return;

    switch (response.type) {
      case "login":
        this._changeToUserMenu(response.data);
        break;
      case "logout":
        this._changeToGuestMenu();
        break;
    }
  }

  _logoutBtnHandler(e){
    const logoutBtn = e.target.closest(`[${ATTRIBUTE_LOGOUT}="${VALUE_LOGOUT}"]`);
    if (!logoutBtn) return;
    e.preventDefault();
    document.dispatchEvent(new CustomEvent("clientSubmit", {detail:{type: "logout"}}))
  }

  _changeToGuestMenu() {
    document.querySelector(`.${CLASS_MENU}`).replaceWith(this._guestMenu);
  }

  _changeToUserMenu(userInfo) {
    this._updateUserMenu(userInfo);
    document.querySelector(`.${CLASS_MENU}`).replaceWith(this._userMenu);
  }

  _createMenuTemplate(){
    const menu = this._guestMenu.cloneNode(true);
    const title = menu.querySelector(`.${CLASS_MENU_TITLE}`);
    title.classList.add(CLASS_MENU_TITLE_SMALL);
    
    const userAvatar = document.createElement("div");
    userAvatar.classList.add(CLASS_USER_AVATAR);
    menu.querySelector(`.${CLASS_GUEST_AVATAR}`).replaceWith(userAvatar);

    const links = menu.querySelectorAll(`.${CLASS_MENU_CONTENT} .${CLASS_MENU_LINK}`);
    links[0].textContent = "My profile";
    links[0].setAttribute(`${ATTRIBUTE_MODAL}`, `${VALUE_MODAL}`);

    links[1].textContent = "Log Out";
    links[1].setAttribute(`${ATTRIBUTE_LOGOUT}`, `${VALUE_LOGOUT}`);
    links[1].removeAttribute(`${ATTRIBUTE_MODAL}`);

    return menu;
  };

  _updateUserMenu(userInfo) {
    const title =this._userMenu.querySelector(`.${CLASS_MENU_TITLE}`);
    title.textContent = userInfo.card;
    
    const userAvatar =this._userMenu.querySelector(`.${CLASS_USER_AVATAR}`);
    userAvatar.setAttribute("title", `${userInfo.firstName} ${userInfo.lastName}`)
    userAvatar.textContent = `${userInfo.firstName.toUpperCase()[0]}${userInfo.lastName.toUpperCase()[0]}`;
  }
}

