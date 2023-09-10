const CLASS_FORM_FIELD ="form-field"
const CLASS_INPUT = "input";
const CLASS_INPUT_STATE = "form-field__state";
const CLASS_MODAL_OPEN = "modal-open";
const CLASS_FORM_STATE = "login-form__state"

export class Login {
  constructor(form){
    this._form = form;
    this._errorField = this._form.querySelector(`.${CLASS_FORM_STATE}`);

    this._bind();
  }

  _bind(){
    this._form.addEventListener("submit", this._submitHandler.bind(this));
    document.addEventListener("serverResponse", this._serverResponseHandler.bind(this));
  }


  _submitHandler(e){
    e.preventDefault();
    const isValid = this._validateFields();

    if (!isValid) {
      return false;
    }

    const authData = {
      email: this._form.email.value,
      password: this._form.password.value
    }

    document.dispatchEvent(new CustomEvent("clientSubmit", {detail: {type: "login", authData: authData}}))
    
    return false;
  }

  _serverResponseHandler(e){
    const response = e.detail;
    if (response.type !== "login") return;

    if (!response.done) {
      this._errorField.textContent = response.message;
      return;
    }

    this._errorField.textContent = "";
    this._clearFields();

    if (document.querySelector("body").classList.contains(CLASS_MODAL_OPEN)) {
      document.modal.close();
    }
  }
  

  _clearFields() {
    const inputs = this._form.querySelectorAll(`.${CLASS_INPUT}`);
    inputs.forEach(input => input.value = "")
  }

  _validateFields(){
    const fields = this._form.querySelectorAll(`.${CLASS_FORM_FIELD}`);
    let isValid = true;

    fields.forEach(field => {
      const input = field.querySelector(`.${CLASS_INPUT}`);
      const state = field.querySelector(`.${CLASS_INPUT_STATE}`);
      const name = input.getAttribute("name");

      let stateContent = "";

      switch (name) {
        case "password":
          if (input.value.length < 8 ) stateContent = "Enter at least 8 characters";
          break;
      }

      if (!input.value.trim().length) stateContent = "Complete the field";

      state.textContent = stateContent;
      if (stateContent) isValid = false;
    });

    return isValid;
  }
}