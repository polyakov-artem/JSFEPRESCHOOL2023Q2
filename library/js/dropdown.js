export class Dropdown {
  constructor(props = {}) {
    this.classDropdown = props.classDropdown || "dropdown";
    this.classToggler = props.classToggler || "dropdown__toggler";
    this.classDropdownActive = props.classDropdownActive || "dropdown_active";
    this.activeDropdown = null;

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("click", this._clickHandler.bind(this));
  }

  _clickHandler(e) {
    const element = e.target;
    const elementTag = element.tagName;
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

    if ((this.activeDropdown && elementTag === "A") || isNotDropdown)
      this._close();
  }

  _open() {
    this.activeDropdown.classList.add(this.classDropdownActive);
  }

  _close() {
    if (!this.activeDropdown) return;

    this.activeDropdown.classList.remove(this.classDropdownActive);
    this.activeDropdown = null;
  }
}
