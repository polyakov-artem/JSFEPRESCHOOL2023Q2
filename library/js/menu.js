const CLASS_HEADER = 'header'
const CLASS_TOGGLER = 'header__toggler'
const CLASS_NAV_MENU = 'header__nav'
const CLASS_HEADER_MENU_OPEN = 'header_menu-open'
const CLASS_TOGGLER_ACTIVE = 'hamburger_active'
const CLASS_ANIMATION_OPEN = 'slideIn'
const CLASS_ANIMATION_CLOSE = 'slideOut'


document.addEventListener("DOMContentLoaded", () => {

    class Header {
        constructor(header) {
            this.header = header;
            this.toggler = header.querySelector(`.${CLASS_TOGGLER}`);
            this.navMenu = header.querySelector(`.${CLASS_NAV_MENU}`);

            this.bindEvents();
        }

        bindEvents() {
            this.toggler.addEventListener("click", () => this.togglerClickHandler());
        }

        closeMenu() {
            this.toggler.classList.remove(CLASS_TOGGLER_ACTIVE);
            this.header.classList.remove(CLASS_HEADER_MENU_OPEN);
            this.navMenu.classList.remove(CLASS_ANIMATION_OPEN);
            this.navMenu.classList.add(CLASS_ANIMATION_CLOSE);
        }

        openMenu() {
            this.toggler.classList.add(CLASS_TOGGLER_ACTIVE);
            this.header.classList.add(CLASS_HEADER_MENU_OPEN);
            this.navMenu.classList.remove(CLASS_ANIMATION_CLOSE);
            this.navMenu.classList.add(CLASS_ANIMATION_OPEN);
        }

        togglerClickHandler() {
            if (!this.header.classList.contains(CLASS_HEADER_MENU_OPEN)) {
                this.openMenu()
            } else this.closeMenu()
        }

        static documentClickHandler(event) {
            const isTogglerClicked = event.target.closest(`.${CLASS_TOGGLER}`);

            if (!isTogglerClicked) {
                Header.closeAllMenus()
            }
        }

        static closeAllMenus(){
            document.querySelectorAll(`.${CLASS_HEADER_MENU_OPEN}`).forEach((header) => {
                header.headerData.closeMenu()
            });
        }
    }

    document.querySelectorAll(`.${CLASS_HEADER}`).forEach((header) => {
        header.headerData = new Header(header)
    });

    document.addEventListener("click", Header.documentClickHandler)
    window.addEventListener("resize", ()=>{ Header.closeAllMenus() })

});