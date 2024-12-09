export class Range {
  constructor(element) {
    this._element = element;
    this._bindEvents();
  }

  _bindEvents() {
    this._element.addEventListener("input", () => {this.updateProgress()});
  }

  updateProgress(){
    const value = this._element.value;
    const progress = (value / this._element.max) * 100;
    this._element.style.background = `linear-gradient(to right, #ff0000 ${progress}%, #ccc ${progress}%)`;
  }
}