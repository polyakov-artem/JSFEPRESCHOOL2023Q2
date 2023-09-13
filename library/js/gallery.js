export class Gallery {
  constructor(element) {
    this._gallery = element;
    this._items = gallery.querySelectorAll(SELECTOR_ITEM);
    this._maxIndex = this._items.length - 1;
    this._activeIndex = 0;

    this._grid = gallery.querySelector(SELECTOR_GRID);

    this._galleryWidth = null;
    this._itemWidth = null;
    this._currentShift = 0;
    this._shiftValue = 0;

    this._itemsPerView = [
      {items: 1, maxVWidth: 768},
      {items: 3, maxVWidth: 1600},
    ]

    this._bindEvents();
  }

  _bindEvents() {
    this._gallery.addEventListener("click", this._clickHandler.bind(this));

    window.addEventListener("load", this._setSizes.bind.this);
    window.addEventListener("resize", this._setSizes.bind.this);
  }

  _setSizes() {
    


    this._galleryWidth = this._grid.offsetWidth();
    this._itemWidth = this._item.offsetWidth();
    this._viewPortWidth = window.innerWidth;
  }

  _clickHandler(e){
    const target = e.target;
    const dots = target.closest(SELECTOR_DOTS);
    const nextBtn = target.closest(SELECTOR_NEXT_BTN);
    const prevBtn = target.closest(SELECTOR_PREV_BTN);

    if (!dots || nextBtn || prevBtn) return;

    if (nextBtn) {

      return;
    }

    if (prevBtn) {

    return;
    }

    if (dots) {

      return;
    }
  };

  _getShiftValue() {}


}