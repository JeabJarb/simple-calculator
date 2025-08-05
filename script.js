// --- Calculator Script ---
// Last updated: Aug 2025
// This script powers a simple calculator: numbers, +, -, ×, ÷, AC, DEL, and chaining results.
// To use: Buttons in HTML should use .keypadNumberButton for numbers, .keypadOperatorButton for operators.

// --- Setup: Select all the DOM elements you need ---
console.log("Calculator script loaded successfully!"); // For debugging

const display = document.getElementById("inputDisplay"); // The calculator screen
const numberButtons = document.querySelectorAll(".keypadNumberButton"); // 0-9 and .
const operatorButtons = document.querySelectorAll(".keypadOperatorButton"); // +, -, ×, ÷, etc.
const acButton = document.getElementById("clear"); // AC (All Clear) button
const delButton = document.getElementById("back"); // DEL (delete) button
const submitButton = document.getElementById("equals"); // = button

// --- Calculator State ---
const toBeCalculated = []; // Stores the current calculation as ["5", "+", "2"]
let justCalculated = false; // Flag: did we just hit "=" ?

// --- Number/Decimal Buttons: Add their value to display ---
numberButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    // If a calculation just happened, clear for new input
    if (justCalculated) {
      display.value = "";
      justCalculated = false;
    }
    // Add the button's value (number or .) to the display
    display.value += button.textContent;
  });
});

// --- AC: Clear all inputs and state ---
function clear() {
  display.value = "";
  toBeCalculated.length = 0;
}

acButton.addEventListener("click", function (event) {
  event.preventDefault();
  clear();
});

// --- DEL: Remove the last character from display ---
function back() {
  display.value = display.value.slice(0, -1);
}

delButton.addEventListener("click", function (event) {
  event.preventDefault();
  back();
});

// --- Operators: Store number and operator, prepare for next number ---
operatorButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    // If just finished calculation, start new expression with result
    if (justCalculated) {
      toBeCalculated.length = 0;
      toBeCalculated.push(display.value);
      justCalculated = false;
    } 
    // Normal case: first number entered
    else if (toBeCalculated.length === 0 && display.value !== "") {
      toBeCalculated.push(display.value);
    }

    // Prevent pushing operator if display is empty
    if (display.value === "") return;

    // Store the operator for calculation
    toBeCalculated.push(button.textContent);
    display.value = ""; // Ready for next number
  });
});

// --- Equals: Evaluate the stored expression ---
function submit() {
  if (display.value === "") return; // Don’t submit if nothing entered

  toBeCalculated.push(display.value);

  // Remove trailing operator if any (e.g. ["5", "+"])
  const last = toBeCalculated[toBeCalculated.length - 1];
  if (["+", "-", "×", "÷", "−", "＋", "–", "﹣"].includes(last)) {
    toBeCalculated.pop();
  }

  // Build the string to evaluate, replacing all symbols with JS equivalents
  let expression = toBeCalculated.join("");
  expression = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/﹣/g, "-")
    .replace(/＋/g, "+");
  
  console.log("Expression array:", toBeCalculated); // See what's being calculated
  console.log("Evaluating:", expression); // Debug final expression

  // Try evaluating, catch errors (like division by 0)
  try {
    display.value = eval(expression);
  } catch (e) {
    display.value = "Error";
  }

  // Reset for next calculation
  toBeCalculated.length = 0;
  justCalculated = true;
}

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  if (display.value !== "") {
    submit();
  } else {
    alert("Please enter a number to calculate.");
  }
});

// --- END OF SCRIPT ---
// Notes for Future Me:
// - Only use eval() if you trust your input (fine for personal use)
// - Make sure button classes in HTML match the selectors above
// - This script supports chaining calculations (e.g., 5 + 2 = - 3 = × 4 = )
// - Want to add keyboard input or percentages? Expand numberButtons/operatorButtons and add new event listeners!
