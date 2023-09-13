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
// import { Gallery } from "./gallery.js";

const SELECTOR_HEADER= ".header";
const SELECTOR_SIGNUP_FORM = ".signup-form";
const SELECTOR_LOGIN_FORM = ".login-form";
const SELECTOR_PROFILE = ".profile-block";
const SELECTOR_ITEM_PICKER = ".item-picker";
const SELECTOR_BUY_CARD = ".buy-card";
const SELECTOR_LIBRARY_CARD = ".library-card";
const SELECTOR_GALLERY = ".gallery";


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

  // document.querySelectorAll(SELECTOR_GALLERY).forEach((element) => {
  //   new Gallery(element);
  // });

  new AuthController();
  
});



console.log(`

Текущая самооценка выполения ТЗ: 175/200

## Требования к функционалу тз
### Этап 1: Пользователь не зарегистрирован
- **Ограниченная карусель в блоке About**
  1. [ ] Карусель реагирует на нажатие кнопок (кнопки под каруселью и стрелочки слева и справа в мобильной версии) и происходит анимация перелистывания. +15
  2. [ ] На экране шириной 1440px проверяем, чтобы было доступно 2 других скрытых картинки. При каждом нажатии выезжает следующая, и так до границ справа и слева. +2
  3. [ ] Выделенная кнопка под каруселью (имеется ввиду кнопка соответствующая активному слайду и которая имеет коричневый цвет) - неактивная. +2
  4. [ ] Если анимация карусели не успела завершиться, при этом нажата была следующая кнопка, то картинка не должна зависнуть в промежуточном состоянии. +2
  5. [ ] На экране шириной 768px проверяем, чтобы было доступно 4 других скрытых картинки. Для этого меняем разрешение и перезагружаем страницу. Теперь доступных перемещений становится 5. +2
  6. [ ] Неактивными становятся не только выделенные кнопки, но и стрелочки на границах карусели. +2
- [x] **Слайдер в блоке Favorites**
  1. [x] "Слайдер" реагирует на нажатие кнопок панели навигации и происходит анимация затухания и проявления. +15
  2. [x] На любой ширине экрана все 4 карточки с книгами одновременно будут плавно затухать, а затем плавно проявляться следующие. +2
  3. [x] Анимация может быть прервана следующим нажатием на кнопку выбора поры года, но при этом анимация не должна застывать в промежуточном состоянии. Если анимация не была прервана следующим нажатием кнопки, то она должна отрабатывать до конца. +2
  4. [x] Во время анимаций высота блока Favorites не должна меняться. +2
  5. [x] ❗Панель навигации "слайдера" сделана по технологии "sticky" для разрешений с одним рядом книг (768px и меньше), т.е. опускается вниз вместе со скроллом страницы, прилипая к верхней части экрана, в рамках блока Favorites. +2
- **До регистрации**
  1. [x] Нажатие на кнопку Check the card ни к чему не приведёт.
- **До авторизации**
  1. [x] Иконка юзера в хедере отображается в виде силуэта.
  2. [x] В блоке Favorites все кнопки должны иметь имя Buy, а не Own. +2
### Этап 2: Пользователь на этапе регистрации
- **Меню авторизации при нажатии на иконку пользователя**
  1. [x] Нажатие на иконку пользователя в хедере открывает меню, которое должно оказаться под иконкой таким образом, что правый верхний угол меню находится в той же точке, что и нижний правый угол контейнера с иконкой в хедере. Меню под иконкой. +2
  2. [x] На разрешении 768px, при открытом бургер-меню, оно закрывается и открывается меню авторизации. +2
  3. [x] То же верно и в обратную сторону, кнопка бургер-меню должна быть доступна при открытом меню авторизации. +2
  4. [x] Нажатие на любую область или элемент вне меню приводят к закрытию меню авторизации. +2
- **Модальное окно REGISTER**
  1. [x] Дизайн модального окна соответствует макету. +15 (позже появятся пункты оценки по каждому элементу в отдельности).
  2. [x] При нажатии на кнопку Register в открытом меню авторизации появляется модальное окно REGISTER, где есть поля First name, Last name, E-mail и Password. +2
  3. [x] При нажатии кнопки Sign Up в блоке  Digital Library Cards также появляется модальное окно REGISTER. +2
  4. [x] Окно центрировано, а область вокруг затемнена (насколько затемнена - не имеет значения). +2
  5. [x] При нажатии на крестик в углу окна, или на затемнённую область вне этого окна, оно закрывается. +2
  6. [x] В данном случае, ограничения по полям - все поля должны быть не пустыми. +2
  7. [x] Пароль должен быть не короче 8 символов. +2
  8. [x] В поле E-mail должна быть валидация типа email. +2
- **Окончание регистрации**
  1. [x] Данные сохраняются в хранилище **localStorage**, в том числе и пароль, хотя в реальной жизни так делать нельзя. +2
  2. [x] Иконка пользователя меняется на заглавные буквы имени. +2
  3. [x] Отображение страницы приходит в состояние после авторизации (этап 4). +2
  4. [x] Будет сгенерирован девятизначный Card Number случайным образом в формате 16-ричного числа. +2
- **При наличии регистрации, но будучи не авторизованным**
  1. [x] Блок Digital Library Cards. Если введённые имя и номер карты совпадают с данными пользователя, то отображается панель с информацией, вместо кнопки Check the card на 10 секунд. +2
  2. [x] Там же после отображения информации, кнопка возвращается в прежнее состояние, а поля в форме сбрасываются. +2
### Этап 3: Пользователь на этапе входа в учётную запись после регистрации.
- **Модальное окно LOGIN**
  1. [x] Дизайн модального окна соответствует макету. +15 (позже появятся пункты оценки по каждому элементу в отдельности).
  2. [x] При нажатии на кнопку Log In появляется модальное окно LOGIN, где есть поля E-mail or readers card и Password. +2
  3. [x] При нажатии кнопки Log In в блоке  Digital Library Cards также появляется модальное окно LOGIN. +2
  4. [x] Окно центрировано, а область вокруг затемнена (насколько затемнена - не имеет значения). +2
  5. [x] При нажатии на крестик в углу окна, или на затемнённую область вне этого окна, оно закрывается. +2
  6. [x] Для авторизации все поля должны быть не пустыми. +2
  7. [x] Пароль должен быть не короче 8 символов. +2
- **Блок Favorites**
  1. [x] Если пользователь ещё не вошёл в учётную запись, то при нажатии на любую кнопку Buy открывается модальное окно LOGIN. +2
### Этап 4: Пользователь после входа в учётную запись
- **Меню профиля при нажатии на иконку с инициалами пользователя**
  1. [x] При наведении курсором на иконку пользователя должно отображаться полное имя пользователя (атрибут title). +2
  2. [x] Нажатие на иконку пользователя в хедере открывает меню, которое должно оказаться под иконкой таким образом, что правый верхний угол меню находится в той же точке, что и нижний правый угол контейнера с иконкой в хедере. Меню под иконкой. +2
  3. [x] На разрешении 768px при открытом бургер-меню, оно закрывается и открывается меню авторизации. +2
  4. [x] То же верно и в обратную сторону, кнопка бургер-меню должна быть доступна. +2
  5. [x] Нажатие на любую область или элемент вне меню приводят к закрытию меню профиля. +2
  6. [x] ❗Вместо надписи Profile отображается девятизначный Card Number. Для Card Number можно использовать меньший шрифт чтобы надпись вметилась в контейнер, +2
  7. [x] Нажатие на кнопку My Profile открывает модальное окно MY PROFILE. +2
  8. [x] Нажатие на кнопку Log Out приводит к выходу пользователю из состояния авторизации, возвращаемся к этапу #1. +2
- **Модальное окно MY PROFILE**
  1. [x] Дизайн модального окна соответствует макету. +15 (позже появятся пункты оценки по каждому элементу в отдельности).
  2. [x] В случае если имя и фамилия слишком длинные и не влазят в блок то должен произойти перенос фамилии на следующую строку.
  3. [x] Счетчик для Visits отображает, сколько раз пользователь проходил процесс авторизации, включая самый первый - регистрацию. +2
  4. [x] Счетчик для Books отображает, сколько у пользователя книг находятся в состоянии Own. Значение варьируется 0-16. +2
  5. [x] Рядом с Card Number есть кнопка, нажатие на которую копирует код карты клиента в буфер обмена. +2
  6. [x] Окно центрировано, а область вокруг затемнена (насколько затемнена - не имеет значения). +2
  7. [x] При нажатии на крестик в углу окна, или на затемненную область вне этого окна, оно закрывается. +2
- **Блок Favorites**
  1. [x] При нажатии на любую кнопку Buy, еще до покупки абонемента, открывается модальное окно BUY A LIBRARY CARD. +2
  2. [x] При нажатии на любую кнопку Buy, после покупки абонемента, меняет вид кнопки на неактивную Own, добавляя единицу к счетчику книг в профиле. +2
  3. [x] Кроме того после нажатия обновляется не только счетчик, но и название книги должно отобразится в разделе Rented Books. Название формируется по принципу <название книги>, <автор книги>. В случае если название книги слишком длинное или список стал слишком большой список книг в блоке Rented Books становится скроллируемым (по необходимости горизонтально/ вертикально или оба скролла сразу) Тайтл Rented Books скроллироваться не должен +2
- **Модальное окно BUY A LIBRARY CARD**
  1. [x] ❗Модальное окно нужно сделать шириной 640px. Будет это обрезка по 5px по бокам, или просто уменьшение длины с сохранением сетки - значения не имеет, хотя при правильной сеточной структуре, сделать это будет намного проще. +2
  1. [x] Дизайн модального окна соответствует макету. +15 (позже появятся пункты оценки по каждому элементу в отдельности).
  2. [x] При нажатии на крестик в углу окна, или на затемнённую область вне этого окна, оно закрывается. +2
  3. Для того, чтобы кнопка Buy была активна, все поля должны быть не пустыми. +2
  4. [x] Bank card number должен содержать 16 цифр. С пробелами каждые 4 символа или нет - значения не имеет. +2
  5. [x] Expiration code содержит 2 поля с ограничением в 2 цифры. +2
  6. [x]  CVC должен содержать 3 цифры. +2
  7. [x] После удачного нажатия на кнопку Buy, окно закрывается, и больше мы к нему не возвращаемся.
- **Блок Digital Library Cards**
  1. [x] При наличии авторизации вместо кнопки Check the Card будут отображаться данные пользователя и бейджи, как на дизайне LibraryCard after login in account. +2
`);