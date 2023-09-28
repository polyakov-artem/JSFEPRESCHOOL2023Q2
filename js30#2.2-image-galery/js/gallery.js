const REQUEST_URL = "https://api.unsplash.com/search/photos";
const CLIENT_ID = "hPl2TqgWM69XM6_HKdYCvh-D-DOH7PId5GU26MYNZpQ";

export class Gallery {
  constructor(element) {
    this._domGallery = element;
    this._domSearchForm = document.querySelector(".header__search");
    this._domSearchInput = this._domSearchForm.querySelector(".input__control");
    this._domImgContainer = element.querySelector(".gallery__grid");

    this._domSearchInput.focus();
    this._bindEvents();
    
  }

  _bindEvents() {
    this._domSearchForm.addEventListener(
      "submit",
      this._submitHandler.bind(this)
    );
  }

  _submitHandler(e) {
    e.preventDefault();
    let query = this._domSearchInput.value.trim();
    if (query.length == 0) return;
    this.searchImages(query);
  }

  async searchImages(query) {
    const url = `${REQUEST_URL}?query=${query}&client_id=${CLIENT_ID}&per_page=30`;
    const imgContainerNotEmpty = this._domImgContainer.children.length != 0;
    if (imgContainerNotEmpty) this._domImgContainer.replaceChildren();

    const json = await this._getData(url);
    if (!json) return;

    this._createImages(json);
  }

  async _getData(url) {
    const response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  async _createImages(json) {
    const tempContainer = new DocumentFragment();

    json.results.forEach((imageInfo) => {
      const img = document.createElement("img");
      img.classList.add("gallery__item");
      img.alt = imageInfo.alt_description;
      img.src = imageInfo.urls.regular;
      tempContainer.append(img);
    });

    this._domImgContainer.append(tempContainer);
  }
}

