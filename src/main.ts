// @ts-nocheck
import "./style.css";

// Definiera globala variabler som pekar på "Lägg till" knapparna
const addIncomeItemBtn = document.querySelector("#addIncomeItemBtn");
const addExpenseItemBtn = document.querySelector("#addExpenseItemBtn");

// Definiera globala variabler som pekar på input-fälten
const incomeDescriptionInput = document.querySelector("#incomeDescription");
const incomeAmountInput = document.querySelector("#incomeAmount");
const expenseDescriptionInput = document.querySelector("#expenseDescription");
const expenseAmountInput = document.querySelector("#expenseAmount");

// Lyssna efter klick på "Lägg till" knappen
addIncomeItemBtn.addEventListener("click", createIncomeBudgetPostOnClick);
addExpenseItemBtn.addEventListener("click", createExpenseBudgetPostOnClick);

// Läs in, spara och skapa budgetpost av inmatat värde
function createIncomeBudgetPostOnClick() {
  console.log("Inkomst-knappen funkar!");
  // 1. läs värden från input-fälten och spara dom i lokala variabler
  const description = incomeDescriptionInput?.value;
  const amount = incomeAmountInput?.value;
  // Testa så det funkar!
  console.log(description);
  console.log(amount);
  // 2. Skapar budgetpost
  const budgetPost = {
    description: description,
    amount: amount,
  };
  console.log(budgetPost);
  // 3. Rendera
}

function createExpenseBudgetPostOnClick() {
  console.log("Utgift-knappen funkar!");

  const description = expenseDescriptionInput?.value;
  const amount = expenseAmountInput?.value;

  console.log(description);
  console.log(amount);

  const budgetPost = {
    description: description,
    amount: amount,
  };
  console.log(budgetPost);
}
