const SELECTOR_CONTROLS = ".item-picker__controls-wrap";
const ATTRIBUTE_TAB = "data-season";
const SELECTOR_TAB_ACTIVE = ".item-picker__tab_active";
const CLASS_TAB_ACTIVE = "item-picker__tab_active";
const CLASS_FADEIN = "item-picker__tab_fadein";
const CLASS_BUY_BTN = "book-block__btn";
const SELECTOR_BOOK = ".book-block";
const SELECTOR_BOOK_TITLE = ".book-block__title"
const SELECTOR_BOOK_AUTHOR = ".book-block__author"
const ATTRIBUTE_ORDER_CODE = "data-order-code"
const ATTRIBUTE_MODAL = "data-modal-id"
const VALUE_MODAL_REGISTER = "modal-register"
const VALUE_MODAL_BUY = "modal-buycard";
const CHECKPOINT_VALUE = 768;
const CLASS_STICKY = "item-picker__controls-wrap_sticky";

export class ItemPicker {
  constructor(element) {
    this._itemPicker = element;
    this._nextTab = null;
    this._isLoggedIn = false;
    this._cardIsPaid = false;
    this._ownBooks = [];
    this._controls = element.querySelector(SELECTOR_CONTROLS);
    this._checkpointReached = window.innerWidth <= CHECKPOINT_VALUE;
    this._controlsPosY = this._controls.offsetTop;

    
    this._bindEvents();
  }

  _bindEvents() {
    this._controls.addEventListener("change", this._changeHandler.bind(this));
    this._itemPicker.addEventListener("click", this._buyBtnHandler.bind(this));

    document.addEventListener("serverResponse",this._serverResponseHandler.bind(this));

    window.addEventListener("resize", this._resizeHandler.bind(this));
    window.addEventListener("scroll", this._scrollHandler.bind(this));
  }

  _changeHandler(e) {
    const nextTabName = e.target.value;
    let nextTab = this._itemPicker.querySelector(
      `[${ATTRIBUTE_TAB}="${nextTabName}"]`
      );

    if (!nextTab) return;
    this._nextTab = nextTab;

    const currentTab = this._itemPicker.querySelector(SELECTOR_TAB_ACTIVE);
    currentTab.classList.remove(CLASS_FADEIN);

    currentTab.addEventListener("transitionend", currentTablistener);
    const self = this;

    function currentTablistener () {
      currentTab.classList.remove(CLASS_TAB_ACTIVE);
      self._nextTab.classList.add(CLASS_TAB_ACTIVE);
      self._nextTab.classList.add(CLASS_FADEIN);
      currentTab.removeEventListener("transitionend", currentTablistener);
    };
  }

  _serverResponseHandler(e) {
    const response = e.detail;
    if (!response.done) return;

    switch (response.type) {
      case "login":
      case "change":
      case "logout":    
          this._updateData(response.data);
          this._updateView()
        break;
    }
  }

  _updateData(userInfo){
    this._isLoggedIn = !!userInfo.email;
    this._cardIsPaid = userInfo.cardIsPaid;
    this._ownBooks = userInfo.books
  }

  _updateView(){
    const buyButtons = this._itemPicker.querySelectorAll(`.${CLASS_BUY_BTN}`);

    if (!this._isLoggedIn) {
      buyButtons.forEach((btn) => {
        btn.setAttribute(ATTRIBUTE_MODAL, VALUE_MODAL_REGISTER);
        btn.removeAttribute("disabled");
        btn.textContent = "Buy"
      });
      return
    }

    if (!this._cardIsPaid) {
      buyButtons.forEach((btn) => btn.setAttribute(ATTRIBUTE_MODAL, VALUE_MODAL_BUY));
      return;
    }

    if (this._cardIsPaid) {
      buyButtons.forEach((btn) => btn.setAttribute(ATTRIBUTE_MODAL, ""));
    }

    this._itemPicker.querySelectorAll(SELECTOR_BOOK).forEach((book) => {
      const bookCode = book.getAttribute(ATTRIBUTE_ORDER_CODE);

      if (!this._ownBooks.find((ownBook) => bookCode === ownBook[0] )) return;

      const buyBtn = book.querySelector(`.${CLASS_BUY_BTN}`);
      buyBtn.setAttribute("disabled", "true");
      buyBtn.textContent = "Own";
    });
  }

  _buyBtnHandler(e) {
    const buyBtn = e.target.closest(`.${CLASS_BUY_BTN}`);
    if (!buyBtn || !this._cardIsPaid || !this._isLoggedIn) return;

    const book = e.target.closest(SELECTOR_BOOK);
    const author = book.querySelector(SELECTOR_BOOK_AUTHOR).textContent.replace(/^By /, "");
    const title = book.querySelector(SELECTOR_BOOK_TITLE).textContent;
    const code = book.getAttribute(ATTRIBUTE_ORDER_CODE);

    document.dispatchEvent(
      new CustomEvent("clientSubmit", {
        detail: {
          authData: document.authController.authData,
          type: "change",
          change: {
            type: "add",
            key: "books",
            value: [code, title, author],
          },
        },
      })
    );
  }

  _resizeHandler(){
    const hadStickyClass = this._controls.classList.contains(CLASS_STICKY);

    if (hadStickyClass) {
      this._controls.classList.remove(CLASS_STICKY);
      this._controlsPosY = this._controls.offsetTop;
      this._controls.classList.add(CLASS_STICKY);
    };
    
    this._checkpointReached = window.innerWidth <= CHECKPOINT_VALUE;

  }

  _scrollHandler(){
    if (window.scrollY > this._controlsPosY && this._checkpointReached) {
      this._controls.classList.add(CLASS_STICKY);
    } else {
      this._controls.classList.remove(CLASS_STICKY);
    }
  }
}
