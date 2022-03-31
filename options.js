function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    maxExpiryDays: document.querySelector("#maxExpiryDays").value
  });
  browser.runtime.reload();
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#maxExpiryDays").value = result.maxExpiryDays || "15";
    document.querySelector("#cc").value = result.maxExpiryDays || "15";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("maxExpiryDays");
  getting.then(setCurrentChoice, onError);
  document.querySelector("#maxExpiryDays")
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
let myinput = document.querySelector("#maxExpiryDays");
myinput.addEventListener("input", () => {
  document.getElementById("cc").value = myinput.value;
});

let cc = document.querySelector("#cc");
cc.addEventListener("input", () => {
  document.getElementById("maxExpiryDays").value = cc.value;
});
document.addEventListener("DOMContentLoaded", restoreOptions);