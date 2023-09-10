import { HeaderNavMenu } from "./headerNavMenu.js";
import { Dropdown } from "./dropdown.js";
import { Modal } from "./modal.js";
import { AuthController } from "./authController.js";
import { Server } from "./server.js";
import { UserMenu } from "./userMenu.js";
import { Signup } from "./signup.js";
import { Login } from "./login.js";
import { Profile } from "./profile.js";
import { BuyCard } from "./buyCard.js";
import { LibraryCard } from "./libraryCard.js";

import { ItemPicker } from "./itemPicker.js";

const SELECTOR_HEADER= ".header";
const SELECTOR_SIGNUP_FORM = ".signup-form";
const SELECTOR_LOGIN_FORM = ".login-form";
const SELECTOR_PROFILE = ".profile-block";
const SELECTOR_ITEM_PICKER = ".item-picker";
const SELECTOR_BUY_CARD = ".buy-card";
const SELECTOR_LIBRARY_CARD = ".library-card";


document.addEventListener("DOMContentLoaded", () => {
  new Server();

  new Dropdown({
    classDropdown: "user-menu",
    classToggler: "user-menu__avatar-wrap",
    classDropdownActive: "user-menu_active",
  });

  new Modal();
  new UserMenu();

  document.querySelectorAll(SELECTOR_HEADER).forEach((element) => {
    new HeaderNavMenu(element);
  });

  document.querySelectorAll(SELECTOR_SIGNUP_FORM).forEach((element) => {
    new Signup(element);
  });

  document.querySelectorAll(SELECTOR_LOGIN_FORM).forEach((element) => {
    new Login(element);
  });

  document.querySelectorAll(SELECTOR_PROFILE).forEach((element) => {
    new Profile(element);
  });

  document.querySelectorAll(SELECTOR_ITEM_PICKER).forEach((element) => {
    new ItemPicker(element);
  });

  document.querySelectorAll(SELECTOR_BUY_CARD).forEach((element) => {
    new BuyCard(element);
  });

  
  document.querySelectorAll(SELECTOR_LIBRARY_CARD).forEach((element) => {
    new LibraryCard(element);
  });

  new AuthController();
  
});
