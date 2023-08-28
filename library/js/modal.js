export class Modal {
  constructor(props = {}) {
    this.attributeToggler = props.attributeToggler || "data-modal-id";
    this.classModalActive = props.classModalActive || "modal-block_active";
    this.classModalWindow = props.classModalWindow || "modal-block__window";

    this.classCloseBtn = props.classCloseBtn || "modal-block__close-btn";
    this.classOverlay = props.classOverlay || "modal-overlay";
    this.classOverlayActive =
      props.classOverlayActive || "modal-overlay_active";
    this.closeClasses = props.closeClasses || [];

    this.closeClasses.push(this.classCloseBtn);

    this.activeModal = null;
    this.overlay = null;

    this.bodyElement = document.querySelector("body");

    this._createOverlay();
    this.bindEvents();
  }

  _createOverlay() {
    if (this.overlay) return;
    this.overlay = document.createElement("div");
    this.overlay.classList.add(this.classOverlay);
    this.bodyElement.append(this.overlay);
  }

  bindEvents() {
    document.addEventListener("click", this._clickHandler.bind(this));
  }

  _clickHandler(e) {
    const element = e.target;
    const toggler = element.closest(`[${this.attributeToggler}]`);
    const modalWindow = element.closest(`.${this.classModalWindow}`);
    const isNotModalWindow = !modalWindow;

    if (toggler) {
      e.preventDefault();

      const nextModal = document.getElementById(
        toggler.getAttribute(this.attributeToggler)
      );
      if (!nextModal) return;

      if (!this.activeModal) {
        this.activeModal = nextModal;
        this._open();
        return;
      }

      if (this.activeModal && nextModal !== this.activeModal) {
        this._closeCurrentWindow();
        this.activeModal = nextModal;
        this._openNextWindow();
        return;
      }
    }

    if (
      this.activeModal &&
      (isNotModalWindow || this._hasParentWithClass(element, this.closeClasses))
    ) {
      this._close();
      return;
    }
  }

  _open() {
    this._addLock();
    this._addModalClasses();
    this._addOverlayClasses();
  }

  _close() {
    this._removeModalClasses();
    this._removeOverlayClasses();
    this._removeLockAfterAnimation();
    this.activeModal = null;
  }

  _closeCurrentWindow() {
    this._removeModalClasses();
  }

  _openNextWindow() {
    this._addModalClasses();
  }

  _removeLockAfterAnimation() {
    const overlay = this.overlay;
    const thisInstance = this;

    const listener = () => {
      thisInstance._removeLock();
      overlay.removeEventListener("transitionend", listener);
    };

    overlay.addEventListener("transitionend", listener);
  }

  _addModalClasses() {
    this.activeModal.classList.add(this.classModalActive);
  }

  _addOverlayClasses() {
    this.overlay.classList.add(this.classOverlayActive);
  }

  _removeModalClasses() {
    this.activeModal.classList.remove(this.classModalActive);
  }

  _removeOverlayClasses() {
    this.overlay.classList.remove(this.classOverlayActive);
  }

  _hasParentWithClass(element, classes) {
    if (!classes.length) return false;

    let parent = element;

    while (parent !== document) {
      if (classes.some((className) => parent.classList.contains(className))) {
        return true;
      }

      parent = parent.parentNode;
    }

    return false;
  }

  _addLock() {
    const scrollWidth = this._getScrollWidth();

    this.bodyElement.style.height = "100%";
    this.bodyElement.style.overflow = "hidden";

    if (scrollWidth) {
      this.bodyElement.style.paddingRight = scrollWidth + "px";
    }
  }

  _removeLock() {
    this.bodyElement.style.paddingRight = "";
    this.bodyElement.style.height = "";
    this.bodyElement.style.overflow = "";
  }

  _getScrollWidth() {
    return window.innerWidth - this.bodyElement.clientWidth;
  }
}
