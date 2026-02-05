// @ts-nocheck

import "./style.css";
import categories from "./categories.json";

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
const incomeDescriptionInput = document.querySelector("#incomeDescription");
const expenseDescriptionInput = document.querySelector("#expenseDescription");
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
  // 1. läs värde från dropdown-lista och spara dom i lokala variabler
  const category = incomeCategorySelect?.value; // null = medvetet tomt värde
  // 2. läs värden från input-fälten
  const description = incomeDescriptionInput?.value;
  const amount = Number(incomeAmountInput?.value); // inte en sträng
  // Testa så det funkar!
  console.log(category);
  console.log(description);
  console.log(amount);
  // 3. Skapa budgetpost
  const budgetPost = {
    category, // dropdown-option
    description, // input-value
    amount, // input-value
  };
  console.log(budgetPost);
  // 3. lägg data i arrayen högst upp i filen
  incomes.push(budgetPost);
  console.log(incomes);

  // 4. Rendera listan så att den syns på skärmen
  renderIncomeBudgetPost();
}

function createExpenseBudgetPostOnClick() {
  console.log("Utgift-knappen funkar!");

  const category = expenseCategorySelect?.value;
  const description = expenseDescriptionInput?.value;
  const amount = expenseAmountInput?.value;

  console.log(category);
  console.log(description);
  console.log(amount);

  const budgetPost = {
    category: category,
    amount: amount,
  };

  expenses.push(budgetPost);

  // Rendera
  renderExpenseBudgetPost();
}

// Rendera options till dropdown (select)
function renderCategoryOptions(selectDropdown, categories) {
  // Kolla så att dropdown-listan finns
  if (!selectDropdown) return;
  // Skapa en tom option
  let html = `<option value="">Välj kategori</option>`;
  // Gå igenom varje kategori i json
  categories.forEach((category) => {
    // Skapa <option>
    html += `<option value="${category.value}">${category.text}</option>`;
  });
  // rendera ut i <select>
  selectDropdown.innerHTML = html;
}

// Rendera budgetposter i <ul> - (kategori, beskrivning + belopp)
function renderIncomeBudgetPost() {
  if (!incomeList) return;

  console.log("renderIncomeBudgetPost körs");

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

function renderExpenseBudgetPost() {
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
  renderIncomeBudgetPost();
}

function deleteExpenseBudgetPost(event) {
  const id = Number(event.target.dataset.id);

  expenses.splice(id, 1);
  renderExpenseBudgetPost();
}

// =================================================================================
// ANROP ===========================================================================
// =================================================================================

/* 
Jag lägger anropen längst ner i filen för att säkerställa att det kommer 
efter JSON är importerad,
querySelector har körts, 
funktioner är definierade
*/

// Anropa rätt dropdown med rätt kategorier
renderCategoryOptions(incomeCategorySelect, categories.income);
renderCategoryOptions(expenseCategorySelect, categories.expense);
