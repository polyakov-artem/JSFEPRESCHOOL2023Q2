const CLASS_VIEWPORT_LOCKED = 'locked'
const CLASS_MODAL_OPEN = 'modal-block_active'

const ATTRIBUTE_TOGGLER = 'data-modal-id'
const SELECTOR_TOGGLER = '[' + ATTRIBUTE_TOGGLER + ']'

const CLASS_CLOSE_BTN = 'modal-block__close-btn'
const SELECTOR_CLOSE_BTN = '.' + CLASS_CLOSE_BTN


document.addEventListener("DOMContentLoaded", () => {

    class Modal {
        constructor() {
            this._activeModal = null;
            this._bodyElement = document.querySelector('body');
            this.bindEvents()
        }

        bindEvents(){
            document.addEventListener("click", this._clickHandler.bind(this));
        }

        _clickHandler(e){
            const toggler = e.target.closest(SELECTOR_TOGGLER);

            if (toggler) {
                e.preventDefault();
                const target = document.getElementById(toggler.getAttribute(ATTRIBUTE_TOGGLER));
                if (!target) return;

                this._activeModal= target;
                this._open();
                return;
            };

            const closeBtn = e.target.closest(SELECTOR_CLOSE_BTN);

            if (closeBtn){
                this._close();
            }
        }

        _open(){
            this._fixViewportShift();
            this._activeModal.classList.add(CLASS_MODAL_OPEN);
            this._bodyElement.classList.add(CLASS_VIEWPORT_LOCKED)
        }

        _close(){
            this._removeViewportFix();
            this._activeModal.classList.remove(CLASS_MODAL_OPEN);
            this._bodyElement.classList.remove(CLASS_VIEWPORT_LOCKED);
            this._activeModal = null;
        }

        _fixViewportShift(){
           let scrollWidth = this._getScrollWidth();
           if (scrollWidth) this._bodyElement.style.paddingRight = scrollWidth + "px";
        }

        _removeViewportFix(){
            this._bodyElement.style.paddingRight = "";
        }

        _getScrollWidth(){
            return window.innerWidth - this._bodyElement.clientWidth;
        }
    }

    new Modal();

});