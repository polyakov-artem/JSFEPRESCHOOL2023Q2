const CLASS_DOT ="gallery__dot"
const CLASS_DOT_ACTIVE ="gallery__dot_active"
const CLASS_DOT_VISIBLE = "gallery__dot_visible";

const SELECTOR_ITEM = ".gallery__item";
const SELECTOR_VIEWPORT = ".gallery__viewport";
const SELECTOR_ITEMS_WRAP = ".gallery__items";
const SELECTOR_NEXT_BTN = ".gallery__next-btn";
const SELECTOR_PREV_BTN = ".gallery__prev-btn";
const SELECTOR_DOTS_WRAP = ".gallery__dots";
const SELECTOR_DOT = `.${CLASS_DOT}`;

export class Gallery {
  constructor(element) {
    this._gallery = element;
    this._items = element.querySelectorAll(SELECTOR_ITEM);
    this._itemsWrap = element.querySelector(SELECTOR_ITEMS_WRAP);
    this._viewport = element.querySelector(SELECTOR_VIEWPORT);
    this._nextBtn = element.querySelector(SELECTOR_NEXT_BTN);
    this._prevBtn = element.querySelector(SELECTOR_PREV_BTN);
    this._dotsContainer = element.querySelector(SELECTOR_DOTS_WRAP);

    this._activeSlide = 0;
    this._numOfSlides = 0;
    this._shiftValue = 0;

    this._viewSettings = [
      { items: 1, maxVWidth: 1024, gap: 0 },
      { items: 3, maxVWidth: Infinity, gap: 25 },
    ];
    this._curViewSettings = {};

    this._getViewSettings();
    this._createDots();
    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener("resize", ()=>{ this._update()});

    window.addEventListener("load", () => {
      this._update();
      this._gallery.addEventListener("click", this._clickHandler.bind(this));
    });
  }

  _createDots() {
    const tempContainer = new DocumentFragment();
    for (let i = 0; i < this._numOfSlides; i++) {
      tempContainer.append(this._createDot());
    }

    tempContainer.children[0].classList.add(CLASS_DOT_ACTIVE);
    this._dotsContainer.append(tempContainer);
    this._dots = this._gallery.querySelectorAll(SELECTOR_DOT);
  }

  _createDot() {
    const dot = document.createElement("span");
    dot.classList.add(CLASS_DOT);
    return dot;
  }

  _update() {
    this._getViewSettings();
    this._getShiftValue(this._viewport.clientWidth);
    this._updateControls();
  }

  _getViewSettings() {
    const windowWidth = window.innerWidth;
    for (let i = 0; i < this._viewSettings.length; i++) {
      if (windowWidth <= this._viewSettings[i].maxVWidth) {
        this._curViewSettings = this._viewSettings[i];
        break;
      }
    };

    this._numOfSlides = this._items.length - this._curViewSettings.items + 1; 
  }

  _getShiftValue(viewportWidth) {
    const { items, gap } = this._curViewSettings;
    const itemWidth = (viewportWidth - (items - 1) * gap) / items;
    this._shiftValue = -(itemWidth + gap);
  }

  _updateControls() {
      this._dots.forEach((dot, index) => {
      if (index < this._numOfSlides) {
        dot.classList.add(CLASS_DOT_VISIBLE);
      } else {
        dot.classList.remove(CLASS_DOT_VISIBLE);
      }
    });
  }

  _slide(slideNum) {
    if (slideNum == this._activeSlide) return;

    this._dots[this._activeSlide].classList.remove(CLASS_DOT_ACTIVE);
    this._dots[slideNum].classList.add(CLASS_DOT_ACTIVE);
    this._itemsWrap.setAttribute("style", `transform: translateX(${this._shiftValue * slideNum}px);`);
    this._activeSlide = slideNum;

    switch (slideNum) {
      case 0:
        this._disableBtn(this._prevBtn);
        break;

      case this._numOfSlides-1:
        this._disableBtn(this._nextBtn);
        break;

      default:
        this._enableBtn(this._prevBtn);
        this._enableBtn(this._nextBtn);
        break;
    }
  }

  _slideRight() {
    if (this._activeSlide == this._numOfSlides) return;
    this._slide(this._activeSlide + 1);
  }

  _slideLeft() {
    if (this._activeIndex == 0) return;
    this._slide(this._activeSlide - 1);
  }

  _disableBtn(btn) {
    btn.setAttribute("disabled", "true");
  }

  _enableBtn(btn) {
    btn.removeAttribute("disabled");
  }

  _clickHandler(e) {
    const target = e.target;
    const dot = target.closest(SELECTOR_DOT);
    const nextBtn = target.closest(SELECTOR_NEXT_BTN);
    const prevBtn = target.closest(SELECTOR_PREV_BTN);

    if (nextBtn) {
      this._slideRight();
      return
    };

    if (prevBtn) {
      this._slideLeft();
      return
    };

    if (dot) {
       let index = 0;
        while (this._dots[index] !== dot) {
          index++;
        }
        this._slide(index);
      return
    };

  }
}
