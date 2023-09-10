const CLASS_FORM_FIELD = "form-field";
const CLASS_INPUT = "input";
const CLASS_INPUT_STATE = "form-field__state";
const CLASS_MODAL_OPEN = "modal-open";
const CLASS_BTN = "buy-card__buy-btn";

export class BuyCard {
  constructor(form) {
    this._form = form;
    this._btn = form.querySelector(`.${CLASS_BTN}`);
    this._inputs = form.querySelectorAll(`.${CLASS_INPUT}`);
    this._fields = form.querySelectorAll(`.${CLASS_FORM_FIELD}`);
    this._bind();
  }

  _bind() {
    this._form.addEventListener("submit", this._submitHandler.bind(this));
    this._form.addEventListener("input", this._changeHandler.bind(this));
  }

  _changeHandler(e){
    const areInputsEmpty = [...this._inputs].every((input) => (input.value.trim() !== ""));

    areInputsEmpty
      ? this._btn.removeAttribute("disabled")
      : this._btn.setAttribute("disabled", "true");
  }

  _submitHandler(e) {
    e.preventDefault();
    const isValid = this._validateFields();

    if (!isValid) {
      return false;
    }

    document.dispatchEvent(
      new CustomEvent("clientSubmit", {
        detail: {
          authData: document.authController.authData,
          type: "change",
          change: {
            type: "set",
            key: "cardIsPaid",
            value: true,
          },
        },
      })
    );

    this._clearFields();
    if (document.querySelector("body").classList.contains(CLASS_MODAL_OPEN)) {
      document.modal.close();
    }

    return false;
  }

  _clearFields() {
    this._inputs.forEach((input) => (input.value = ""));
    this._fields.forEach(field => field.querySelector(`.${CLASS_INPUT_STATE}`).textContent= "");
    this._btn.setAttribute("disabled", "true");
  }

  _validateFields() {
    let isValid = true;

    this._fields.forEach((field) => {
      const inputs =  field.querySelectorAll(CLASS_INPUT);
      const hasFewinputs = inputs.length > 1;
      const state = field.querySelector(`.${CLASS_INPUT_STATE}`);
      let errorText;

      if (!hasFewinputs) {
        errorText = this._isValidField(this._getInputData(inputs[0]));
      } else {
         for (let i = 0; i < inputs.length; i++) {
           errorText = this._isValidField(this._getInputData(inputs[i]));
           if (errorText) break;
         }
      }

      state.textContent = errorText;
      if (errorText) isValid = false;
    });

    return isValid;
  }

  _getInputData(input){
    return {
      name: input.getAttribute("name"),
      value: input.value.replace(/ /g, "")
    }
  }

  _isValidField(inputData){
    const { name, value } = inputData;
    let errorText = "";
    if (!value.length) errorText = "Complete the field";

    switch (name) {
      case "bank-card":
        const cardRegexp = /^[0-9]{16}$/;
        if (!cardRegexp.test(value)) errorText = "Must contain 16 digits";
        break;
      case "cvc":
        const cvcRegexp = /^[0-9]{3}$/;
        if (!cvcRegexp.test(value)) errorText = "Must contain 3 digits";
        break;
      case "exp-month":
        const monthRegexp = /(^0[1-9]$|^1[0-2]$)/;
        if (!monthRegexp.test(value)) errorText = "Must be valid month";
        break;
      case "exp-year":
        const yearRegexp = /^[0-9]{2}$/;
        if (!yearRegexp.test(value))
          errorText = "Must contain 2 digits";
        break;
    };

    return errorText
  }
}
