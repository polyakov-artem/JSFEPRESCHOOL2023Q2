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


console.log(`Требования к вёрстке:
1. Вёрстка соответствует макету. Ширина экрана 768px **+26**
   - [x] блок \<header> +2
   - [x] секция Welcome +2
   - [x] секция About +2. Обратите внимание на появление новых элементов в виде стрелок.
   - [x] Обратите внимание. На макете в секции About расположены 3 точки навигации по слайдам под картинкой. Нужно сделать 5 точек, т.к. картинки лишь скрываются, а не пропадают. Если под картинкой находится 5 точек: +2
   - [x] секция Favorites +4
   - [x] секция CoffeShop +4
   - [x] секция Contacts +4
   - [x] секция LibraryCard +4
   - [x] блок \<footer> + 2

2. Ни на одном из разрешений до 640px включительно не появляется горизонтальная полоса прокрутки. Весь контент страницы при этом сохраняется: не обрезается и не удаляется **+12**
   - [x] нет полосы прокрутки при ширине страницы от 1440рх до 640рх +4.
   - [x] элементы не выходят за пределы окна браузера при ширине страницы от 1440рх до 640рх +4.
   - [x] элементы не наезжают друг на друга при ширине страницы от 1440рх до 640рх +4. Например, меню в хедере должно преобразоваться в бургер-меню до того, как элементы начнут наезжать друг на друга.
   - [x] все что будет происходить на ширине свыше 1440px - не оценивается. Поэтому можно либо растягивать на весь экран, либо оставить центральной колонкой.

3. На ширине экрана 768рх реализовано адаптивное меню **+12** (Рекомендуется сделать появление бургер-меню на ширине 1024px):
   - [x] если при ширине страницы в 768рх панель навигации не скрыта, а бургер-иконка не появилась (при этом учитывайте "Особенности проверки адаптивности в DevTools"), то ставим **0** за данный пункт, и дальше его не проверяем. Иначе:
   - [x] при нажатии на бургер-иконку плавно появляется адаптивное меню +4
   - [x] при нажатии на крестик, или на область вне меню, адаптивное меню плавно скрывается, уезжая за экран +4
   - [x] ссылки в адаптивном меню работают, обеспечивая плавную прокрутку по якорям при нажатии, а само адаптивное меню при этом плавно скрывается +2
   - [x] размеры открытого бургер-меню соответствуют макету, так же открытое бургер-меню проверяется на PixelPerfect +2


Итого: 50/50`);

