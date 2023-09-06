export class Dropdown {
  constructor(props = {}) {
    this.classDropdown = props.classDropdown || "dropdown";
    this.classToggler = props.classToggler || "dropdown__toggler";
    this.classDropdownActive = props.classDropdownActive || "dropdown_active";
    this.closeClasses = props.closeClasses || [];
    this.closeOnOutsideClick = props.closeOnOutsideClick || true;
    this.activeDropdown = null;

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("click", this._clickHandler.bind(this));
  }

  _clickHandler(e) {
    const element = e.target;
    const toggler = element.closest(`.${this.classToggler}`);
    const dropdown = element.closest(`.${this.classDropdown}`);
    const isNotDropdown = !dropdown;

    if (toggler && dropdown) {
      e.preventDefault();

      this.activeDropdown = dropdown;

      dropdown.classList.contains(this.classDropdownActive)
        ? this._close()
        : this._open();

      return;
    }

    if (
      (this.activeDropdown && this.closeOnOutsideClick && isNotDropdown) ||
      this._hasParentWithClass(element, this.closeClasses)
    ) {
      this._close();
      return;
    }
  }

  _hasParentWithClass(element, classes) {
    if (!classes.length) return false;
    let parent = element;

    while (parent !== document) {
      if (classes.some((className) => parent.classList.contains(className))) {
        return true;
      };
      parent = parent.parentNode;
    }

    return false;
  }

  _open() {
    if (this.activeDropdown)
      this.activeDropdown.classList.add(this.classDropdownActive);
  }

  _close() {
    if (this.activeDropdown) {
      this.activeDropdown.classList.remove(this.classDropdownActive);
      this.activeDropdown = null;
    }
  }
}
