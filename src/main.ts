// @ts-nocheck

import "./style.css";
import categories from "./categories.json";

// =================================================================================
// localStorage ====================================================================
// =================================================================================

/*
Här är listorna med data (värden från inputs och select) 
som ska sparas i localStorage.

"const" låser arrayen, inte innehållet
*/

const incomes = [];
const expenses = [];

// =================================================================================
// VARIABLER / QUERY-SELECTORS =====================================================
// =================================================================================

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

// Balans
const balanceEl = document.querySelector("#balance");

// =================================================================================
// EVENT-LYSSNARE ==================================================================
// =================================================================================

// Lyssna efter klick på "Lägg till" knappar
addIncomeItemBtn?.addEventListener("click", createIncomeBudgetPostOnClick);
addExpenseItemBtn?.addEventListener("click", createExpenseBudgetPostOnClick);

// =================================================================================
// FUNKTIONER ======================================================================
// =================================================================================

// Läs in, spara och skapa budgetpost av inmatat värde (data)
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
    amount: Number(incomeAmountInput.value), // input-value
  };

  // 4. uppdatera data (i arrayen högst upp i filen)
  incomes.push(budgetPost);
  // 5. spara data
  saveToLocalStorage();
  // 6. visa data (visuellt på sidan)
  renderIncomeBudgetPost();
  renderBalance();
}

function createExpenseBudgetPostOnClick() {
  console.log("Utgift-knappen funkar!");

  const category = expenseCategorySelect?.value;
  const description = expenseDescriptionInput?.value;
  const amount = Number(expenseAmountInput?.value);

  console.log(category);
  console.log(description);
  console.log(amount);

  const budgetPost = {
    category,
    description,
    amount: Number(expenseAmountInput.value),
  };

  expenses.push(budgetPost);
  saveToLocalStorage();
  renderExpenseBudgetPost();
  renderBalance();
}

// Rendera budgetposter i <ul> - (kategori, beskrivning + belopp)
function renderIncomeBudgetPost() {
  if (!incomeList) return;

  console.log("renderIncomeBudgetPost körs");

  let html = "";

  incomes.forEach((budgetPost, index) => {
    html += `
      <li>${budgetPost.category}: ${budgetPost.description} - ${budgetPost.amount} kr
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
        ${budgetPost.category}: ${budgetPost.description} - ${budgetPost.amount}
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
  saveToLocalStorage();
  renderIncomeBudgetPost();
  renderBalance();
}

function deleteExpenseBudgetPost(event) {
  const id = Number(event.target.dataset.id);

  expenses.splice(id, 1);
  saveToLocalStorage();
  renderExpenseBudgetPost();
  renderBalance();
}

// -------------------------------------------------------------------------------
// DROPDOWN ----------------------------------------------------------------------

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

// -------------------------------------------------------------------------------
// LOCAL STORAGE -----------------------------------------------------------------

// Spara till localStorage
function saveToLocalStorage() {
  // Gör om arrayer till strings (text) och spara dom till localStorage
  localStorage.setItem("incomes", JSON.stringify(incomes));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Läs från localStorage
function loadFromLocalStorage() {
  // Hämta sparad data och gör om text --> objekt och lägg i array
  const savedIncomes = localStorage.getItem("incomes");
  const savedExpenses = localStorage.getItem("expenses");

  if (savedIncomes) {
    incomes.push(...JSON.parse(savedIncomes));
  }

  if (savedExpenses) {
    expenses.push(...JSON.parse(savedExpenses));
  }
}

// -------------------------------------------------------------------------------
// BALANS ------------------------------------------------------------------------

// Räkna balansen
function calculateBalance() {
  let totalIncome = 0;
  let totalExpense = 0;

  incomes.forEach((post) => {
    totalIncome += post.amount;
  });

  expenses.forEach((post) => {
    totalExpense += post.amount;
  });

  // inkomst - utgift
  return totalIncome - totalExpense;
}

// Rendera balansen
function renderBalance() {
  if (!balanceEl) return;

  const balance = calculateBalance();
  balanceEl.textContent = `Balans: ${balance} kr`;
}

// =================================================================================
// ANROP ===========================================================================
// =================================================================================

/* 
Jag lägger anropen längst ner i filen för att säkerställa att det kommer EFTER:
JSON är importerad,
querySelector har körts, 
funktioner är definierade
*/

// Rad 1 - Data FÖRST ______________________________________________________________

// data hämtas från local storage efter sidladdning
loadFromLocalStorage();

// Rad 2 - UI efter ________________________________________________________________

renderIncomeBudgetPost();
renderExpenseBudgetPost();
renderBalance();

// Rad 3 - Flexibla ________________________________________________________________

// Anropa rätt dropdown med rätt kategorier
renderCategoryOptions(incomeCategorySelect, categories.income);
renderCategoryOptions(expenseCategorySelect, categories.expense);
