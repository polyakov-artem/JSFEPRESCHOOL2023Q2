export class Input {
  constructor(element) {
    this._domInput = element;
    this._domInputControl = element.querySelector(".input__control");
    this._domClearBtn = element.querySelector(".input__clear-btn");

      this._domInput.focus();
    this._bindEvents();
  }

  _bindEvents() {
    this._domInputControl.addEventListener("input", ()=>{
      if (this._domInputControl.value.length>0) {
        this._domInput.classList.add("input_not-empty");
      } else {
        this._domInput.classList.remove("input_not-empty");
      }
    });

    this._domClearBtn.addEventListener("click", ()=>{
      this._domInput.classList.remove("input_not-empty");
      this._domInputControl.focus();
    });
  }
}
