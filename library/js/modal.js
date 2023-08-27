export class Modal {
  constructor(props = {}) {
    this.classModal = props.classModal || 'modal-block'
    this.classModalContent = props.classModalContent || 'modal-block__content'
    this.attributeToggler = props.attributeToggler || "data-modal-id";
    this.classModalActive = props.classModalActive || "modal-block_active";
    this.classCloseBtn = props.classCloseBtn ||  "modal-block__close-btn";
    this.classViewportLocked = props.classViewportLocked || "locked";
    this.closeOnOutsideClick = props.closeOnOutsideClick || true;
    this.closeClasses = props.closeClasses || [];

    this.closeClasses.push(this.classCloseBtn);

    this.activeModal = null;
    this.bodyElement = document.querySelector("body");
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("click", this._clickHandler.bind(this));
  }

  _clickHandler(e) {
    const element = e.target;
    const toggler = element.closest(`[${this.attributeToggler}]`);
    const modalContent = element.closest(`.${this.classModalContent}`);
    const isNotModalContent= !modalContent;

    if (toggler) {
      e.preventDefault();

      const nextModal = document.getElementById(toggler.getAttribute(this.attributeToggler));
      if (!nextModal) return;

      this.activeModal = nextModal;
      this._open();
      return;
    };
    
    if (
        this.activeModal &&
        this.closeOnOutsideClick && isNotModalContent ||
        this._hasParentWithClass(element, this.closeClasses)
      ) {
      this._close();
      return
    }
  }

  _open() {
    this._addLock();
    this._addActiveClasses()
  }

  _close() {
    this._removeActiveClasses();
    this._removeLockAfterAnimation();
    this.activeModal = null;
  }

  _removeLockAfterAnimation(){
    const modal = this.activeModal;
    const thisInstance = this;
    
    const listener = ()=>{
      thisInstance._removeLock ();
      modal.removeEventListener("transitionend", listener)
    };

    modal.addEventListener("transitionend", listener);
  }

  _addActiveClasses(){
    this.activeModal.classList.add(this.classModalActive);
  }

  _removeActiveClasses(){
    this.activeModal.classList.remove(this.classModalActive);
  }

  _hasParentWithClass (element, classes) {
    if (!classes.length) return false;

    let parent = element;

    while (parent !== document) {
      console.log(parent);
      if (classes.some(className => parent.classList.contains(className))) {
        return true;
      };
      
      parent = parent.parentNode;
    };

    return false; 
  }

  _addLock() {
    const scrollWidth = this._getScrollWidth();

    this.bodyElement.style.height = "100%";
    this.bodyElement.style.overflow = "hidden";

    if (scrollWidth) {
      this.bodyElement.style.paddingRight = scrollWidth + "px"
    };
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
