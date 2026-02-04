// @ts-nocheck
import "./style.css";

// =================================================================================
// VARIABLER =======================================================================
// =================================================================================

// Här är listorna med data (värden från inputs)
const incomes = [];
const expenses = [];

// Definiera globala variabler som pekar på "Lägg till" knapparna
const addIncomeItemBtn = document.querySelector("#addIncomeItemBtn");
const addExpenseItemBtn = document.querySelector("#addExpenseItemBtn");

// Dropdowns
const incomeCategorySelect = document.querySelector("#incomeCategory");
const expenseCategorySelect = document.querySelector("#expenseCategory");

// Definiera globala variabler som pekar på input-fälten
const incomeAmountInput = document.querySelector("#incomeAmount");
const expenseAmountInput = document.querySelector("#expenseAmount");

// Listor där budgetposter ska renderas
const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

// =================================================================================
// EVENT-LYSSNARE ==================================================================
// =================================================================================

// Lyssna efter klick på "Lägg till" knappar
addIncomeItemBtn?.addEventListener("click", createIncomeBudgetPostOnClick);
addExpenseItemBtn?.addEventListener("click", createExpenseBudgetPostOnClick);

// =================================================================================
// FUNKTIONER ======================================================================
// =================================================================================

// Läs in, spara och skapa budgetpost av inmatat värde
function createIncomeBudgetPostOnClick() {
  console.log("Inkomst-knappen funkar!");
  // 1. läs värden från input-fälten och spara dom i lokala variabler
  const category = incomeCategorySelect?.value;
  const amount = incomeAmountInput?.value;
  // Testa så det funkar!
  console.log(category);
  console.log(amount);
  // 2. Skapar budgetpost
  const budgetPost = {
    category: category,
    amount: amount,
  };
  console.log(budgetPost);
  // 3. lägg data i array
  incomes.push(budgetPost);
  console.log(incomes);

  // 4. Rendera listan så att den syns på skärmen
  renderIncomeList();
}

function createExpenseBudgetPostOnClick() {
  console.log("Utgift-knappen funkar!");

  const category = expenseCategorySelect?.value;
  const amount = expenseAmountInput?.value;

  console.log(category);
  console.log(amount);

  const budgetPost = {
    category: category,
    amount: amount,
  };

  expenses.push(budgetPost);

  // Rendera utgiftslistan
  renderExpenseList();
}

// Rendera budgetposter
function renderIncomeList() {
  if (!incomeList) return;

  console.log("renderIncomeList körs");

  let html = "";

  incomes.forEach((budgetPost, index) => {
    html += `
      <li>
        ${budgetPost.category} - ${budgetPost.amount}
        <button class="delete-income" data-id="${index}">Radera</button>
      </li>`;
  });

  incomeList.innerHTML = html;

  document.querySelectorAll("button.delete-income").forEach((btn) => {
    btn.addEventListener("click", deleteIncomeBudgetPost);
  });
}

function renderExpenseList() {
  if (!expenseList) return;

  let html = "";

  expenses.forEach((budgetPost, index) => {
    html += `
      <li>
        ${budgetPost.category} - ${budgetPost.amount}
        <button class="delete-expense" data-id="${index}">Radera</button>
      </li>`;
  });

  expenseList.innerHTML = html;

  document.querySelectorAll("button.delete-expense").forEach((btn) => {
    btn.addEventListener("click", deleteExpenseBudgetPost);
  });
}

// Radera budgetposter
function deleteIncomeBudgetPost(event) {
  const id = Number(event.target.dataset.id);

  incomes.splice(id, 1);
  renderIncomeList();
}

function deleteExpenseBudgetPost(event) {
  const id = Number(event.target.dataset.id);

  expenses.splice(id, 1);
  renderExpenseList();
}
