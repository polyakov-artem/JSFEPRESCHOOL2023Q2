const SELECTOR_COPY_BTN = ".copy__btn";
const SELECTOR_COPY_MESSAGE = ".copy__message";
const CLASS_MESSAGE_ACTIVE = "copy__message_active";

export class Copy {
  constructor(element, elementCopy){
    this._domElement = element;
    this._domToCopy = elementCopy;
    this._domMessage = element.querySelector(SELECTOR_COPY_MESSAGE);
    this._bind()
  }

  _bind(){
    this._domElement
      .querySelector(SELECTOR_COPY_BTN)
      .addEventListener("click", this._clickHandler.bind(this));
  }

  _clickHandler(e){
    let message = "";
    const self = this;

    navigator.clipboard.writeText(self._domToCopy.textContent)
      .then(() => {
        message = 'Copied';
        },() => {
        message = 'Failed to copy';
      })
      .finally(()=>{
        self._domMessage.textContent = message;
        self._domMessage.classList.add(CLASS_MESSAGE_ACTIVE);
        
        setTimeout(()=>{
          self._domMessage.classList.remove(CLASS_MESSAGE_ACTIVE);
        }, 1000)
      })
  }
}