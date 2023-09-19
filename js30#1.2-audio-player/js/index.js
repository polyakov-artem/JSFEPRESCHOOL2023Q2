import { Player } from "./player.js";

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".player").forEach((element) => {
    new Player(element);
  });

});

