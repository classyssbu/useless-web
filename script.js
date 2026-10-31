const display = document.getElementById("display");
const keypad = document.getElementById("keypad");
const overlay = document.getElementById("subscription-overlay");
const closePopupButton = document.getElementById("close-popup");
const subscribeButton = document.getElementById("subscribe-button");
const subscriptionMessage = document.getElementById("subscription-message");
const priceValue = document.getElementById("price-value");
const complexityNote = document.getElementById("complexity-note");

let currentInput = "";

const basePrice = 29.99;
const includedDigits = 3;
const extraDigitPrice = 2.00;

function updateDisplay() {
  display.textContent = currentInput || "0";
}

function getDigitCount(expression) {
  return (expression.match(/[0-9]/g) || []).length;
}

function getSubscriptionPrice(expression) {
  const digitCount = getDigitCount(expression);
  const extraDigits = Math.max(0, digitCount - includedDigits);
  return {
    digitCount,
    price: basePrice + (extraDigits * extraDigitPrice)
  };
}

function openSubscriptionPopup() {
  const pricing = getSubscriptionPrice(currentInput);

  priceValue.textContent = "$" + pricing.price.toFixed(2);

  if (pricing.digitCount <= includedDigits) {
    complexityNote.textContent = "Standard calculation pricing";
  } else {
    complexityNote.textContent =
      pricing.digitCount + " digits detected • " +
      (pricing.digitCount - includedDigits) +
      " fee increases applied";
  }

  subscriptionMessage.textContent = "";
  overlay.hidden = false;
  closePopupButton.focus();
}

function closeSubscriptionPopup() {
  overlay.hidden = true;
}

function addToInput(value) {
  if (value === ".") {
    const currentNumber = currentInput.split(/[+\-*/]/).pop();
    if (currentNumber.includes(".")) return;
  }

  if (/[+*/]$/.test(currentInput) && /[+*/]/.test(value)) return;

  currentInput += value;
  updateDisplay();
}

function handleAction(action) {
  if (action === "clear") {
    currentInput = "";
    updateDisplay();
  } else if (action === "backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  } else if (action === "equals") {
    openSubscriptionPopup();
  }
}

keypad.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.action) {
    handleAction(button.dataset.action);
  } else if (button.dataset.value) {
    addToInput(button.dataset.value);
  }
});

closePopupButton.addEventListener("click", closeSubscriptionPopup);

overlay.addEventListener("click", function (event) {
  if (event.target === overlay) closeSubscriptionPopup();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !overlay.hidden) {
    closeSubscriptionPopup();
    return;
  }

  if (!overlay.hidden) return;

  if (/^[0-9.]$/.test(event.key)) {
    event.preventDefault();
    addToInput(event.key);
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    event.preventDefault();
    addToInput(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    openSubscriptionPopup();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    handleAction("backspace");
  } else if (event.key === "Delete" || event.key.toLowerCase() === "c") {
    event.preventDefault();
    handleAction("clear");
  }
});

subscribeButton.addEventListener("click", function () {

  subscriptionMessage.textContent =
    "Did you seriously just try to pay for a calculator?";
});

updateDisplay();
