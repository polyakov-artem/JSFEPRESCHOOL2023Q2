import { HeaderNavMenu } from "./headerNavMenu.js";
import { Dropdown } from "./dropdown.js";
import { Modal } from "./modal.js";
import { App } from "./app.js";
import { Server } from "./server.js";
import { UserMenu } from "./userMenu.js";
import { Signup } from "./signup.js";
import { Login } from "./login.js";

const SELECTOR_SIGNUP_FORM = ".signup-form";
const SELECTOR_LOGIN_FORM = ".login-form";

document.addEventListener("DOMContentLoaded", () => {
  const server = new Server();
  new HeaderNavMenu();

  new Dropdown({
    classDropdown: "user-menu",
    classToggler: "user-menu__avatar-wrap",
    classDropdownActive: "user-menu_active",
    closeClasses: ["user-menu__link"],
  });

  new Modal();
  new UserMenu();

  
  const app = new App(server);

  document.querySelectorAll(SELECTOR_SIGNUP_FORM).forEach((form) => {
    new Signup(form, app);
  });

  document.querySelectorAll(SELECTOR_LOGIN_FORM).forEach((form) => {
    new Login(form, app);
  });
  
});
