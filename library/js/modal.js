const ATTRIBUTE_TOGGLER = "data-modal-id";
const CLASS_MODAL_ACTIVE = "modal-block_active";
const CLASS_MODAL_WINDOW = "modal-block__window";
const CLASS_CLOSE_BTN = "modal-block__close-btn";
const CLASS_OVERLAY = "modal-overlay";
const CLASS_OVERLAY_ACTIVE = "modal-overlay_active";
const CLASS_MODAL_OPEN = "modal-open"


export class Modal {
  constructor() {
    this._activeModal = null;
    this._overlay = null;
    this._bodyElement = document.querySelector("body");

    this._createOverlay();
    this._bind();
  }

  _createOverlay() {
    if (this._overlay) return;
    this._overlay = document.createElement("div");
    this._overlay.classList.add(CLASS_OVERLAY);
    this._bodyElement.append(this._overlay);
  }

  _bind() {
    document.addEventListener("click", this._clickHandler.bind(this));
    document.modal = this;
  }

  _clickHandler(e) {
    const element = e.target;
    const toggler = element.closest(`[${ATTRIBUTE_TOGGLER}]`);
    const closeBtn = element.closest(`.${CLASS_CLOSE_BTN}`);
    const modalWindow = element.closest(`.${CLASS_MODAL_WINDOW}`);
    const isNotModalWindow = !modalWindow;

    if (toggler) {
      e.preventDefault();

      const nextModal = document.getElementById(
        toggler.getAttribute(ATTRIBUTE_TOGGLER)
      );
      if (!nextModal) return;

      if (!this._activeModal) {
        this._activeModal = nextModal;
        this._open();
        return;
      }

      if (this._activeModal && nextModal !== this._activeModal) {
        this._removeModalClasses();
        this._activeModal = nextModal;
        this._addModalClasses();
        return;
      }
    }

    if (isNotModalWindow || closeBtn) {
      this.close();
    }
  }

  _open() {
    this._addLock();
    this._addModalClasses();
    this._addOverlayClasses();
    this._addBodyClasses();
  }

  close() {
    if (!this._activeModal) return;
    this._removeModalClasses();
    this._removeOverlayClasses();
    this._removeLockAfterAnimation();
    this._removeBodyClasses();
    this._activeModal = null;
  }

  _removeLockAfterAnimation() {
    const overlay = this._overlay;
    const thisInstance = this;

    const listener = () => {
      thisInstance._removeLock();
      overlay.removeEventListener("transitionend", listener);
    };

    overlay.addEventListener("transitionend", listener);
  }

  _addBodyClasses() {
    this._bodyElement.classList.add(CLASS_MODAL_OPEN);
  }

  _removeBodyClasses() {
    this._bodyElement.classList.remove(CLASS_MODAL_OPEN);
  }

  _addModalClasses() {
    this._activeModal.classList.add(CLASS_MODAL_ACTIVE);
  }

  _removeModalClasses() {
    this._activeModal.classList.remove(CLASS_MODAL_ACTIVE);
  }

  _addOverlayClasses() {
    this._overlay.classList.add(CLASS_OVERLAY_ACTIVE);
  }

  _removeOverlayClasses() {
    this._overlay.classList.remove(CLASS_OVERLAY_ACTIVE);
  }

  _addLock() {
    const scrollWidth = this._getScrollWidth();

    this._bodyElement.style.height = "100%";
    this._bodyElement.style.overflow = "hidden";

    if (scrollWidth) {
      this._bodyElement.style.paddingRight = scrollWidth + "px";
    }
  }

  _removeLock() {
    this._bodyElement.style.paddingRight = "";
    this._bodyElement.style.height = "";
    this._bodyElement.style.overflow = "";
  }

  _getScrollWidth() {
    return window.innerWidth - this._bodyElement.clientWidth;
  }
}
