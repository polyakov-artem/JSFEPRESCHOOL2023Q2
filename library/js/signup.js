const CLASS_FORM_FIELD = "form-field";
const CLASS_INPUT = "input";
const CLASS_INPUT_STATE = "form-field__state";
const CLASS_MODAL_OPEN = "modal-open";
const CLASS_FORM_STATE = "signup-form__state";

export class Signup {
  constructor(form) {
    this._form = form;
    this._errorField = this._form.querySelector(`.${CLASS_FORM_STATE}`);

    this._bind();
  }

  _bind(){
    this._form.addEventListener("submit", this._submitHandler.bind(this));
    document.addEventListener("serverResponse", this._serverResponseHandler.bind(this));
  }


  _submitHandler(e) {
    e.preventDefault();
    const isValid = this._validateFields();

    if (!isValid) {
      return false;
    }

    const signupData = {
      firstName: this._form.firstName.value,
      lastName: this._form.lastName.value,
      email: this._form.email.value,
      password: this._form.password.value,
    };

    document.dispatchEvent(
      new CustomEvent("clientSubmit", {detail: { type: "signup", signupData: signupData }})
    );

    return false;
  }

  _serverResponseHandler(e) {
    const response = e.detail;
    if (response.type !== "signup") return;

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
    inputs.forEach((input) => (input.value = ""));
  }

  _validateFields() {
    const fields = this._form.querySelectorAll(`.${CLASS_FORM_FIELD}`);
    let isValid = true;

    fields.forEach((field) => {
      const input = field.querySelector(`.${CLASS_INPUT}`);
      const state = field.querySelector(`.${CLASS_INPUT_STATE}`);
      const name = input.getAttribute("name");

      let errorText = "";

      switch (name) {
        case "password":
          if (input.value.length < 8)
            errorText = "Enter at least 8 characters";
          break;
        case "email":
          let regexp =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
          if (!regexp.test(input.value)) errorText = "Enter valid email";
          break;
      }

      if (!input.value.trim().length) errorText = "Complete the field";

      state.textContent = errorText;
      if (errorText) isValid = false;
    });

    return isValid;
  }
}
