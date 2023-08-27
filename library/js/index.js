import "./headerNavMenu.js";
import {Modal} from "./modal.js"
import {Dropdown} from "./dropdown.js"

document.addEventListener("DOMContentLoaded", () => {
    new Dropdown({
        classDropdown: 'user-menu',
        classToggler: 'user-menu__avatar-wrap',
        classDropdownActive: 'user-menu_active',
        closeClasses: ['user-menu__link']
    });

    new Modal();
});