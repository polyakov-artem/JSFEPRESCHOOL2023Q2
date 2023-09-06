export class Login {
  constructor(form, app){
    this._form = form;
    this._app = app;
    // this.data = {};
    // this.isValid = false;

    this._bindEvents();
  }

  _bindEvents(){
    this._form.addEventListener("submit", this._send.bind(this));
  }

  _send(e){
    e.preventDefault();
    
    this._app.login({
      email: "some@mail.ri",
      password: "123",
    });

    return false;
  }

  // _submitHandler(e){
  //   e.preventDefault();
  //   console.log(this.form.elements);

  //   this._getFormData();
  //   this._validateForm();

  //   if (this.isValid) {
  //     this._getData();
  //     this._sendData();
  //     this._clear();
  //   };
  // }

  // _getFormData(){
  //   const formData = {

  //   }
  //   this.formData = formData;
  // }

  // _getData(){
  //   for (let key in this.formData){
  //     this.data[key] = this.formData[key].value
  //   }
  // }

  // _validateForm(){
  //   this.isValid = true;
  // }


  // _sendData(){
  //   document.dispatchEvent(new CustomEvent("eSignup", {
  //     detail: this.data
  //   }))
  // }

  // _clear(){

  // }
}
