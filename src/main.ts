// @ts-nocheck
import "./style.css";

// Definiera variabler som pekar på "Lägg till" knapparna
const addIncomeItem = document.querySelector("#addIncomeItem");
const addExpenseItem = document.querySelector("#addExpenseItem");
// Definiera variabler som pekar på input-fälten

// Lyssna efter klick på "Lägg till" knappen
addIncomeItem?.addEventListener("click", readIncomeInput);
addExpenseItem?.addEventListener("click", readExpenseInput);

// Funktion som läser värden från input-fälten
function readIncomeInput() {
  console.log("Inkomst-knappen funkar!");
}

function readExpenseInput() {
  console.log("Utgift-knappen funkar!");
}
