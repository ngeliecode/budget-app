// @ts-nocheck

import "./style.css";
import categories from "./categories.json";

// =================================================================================
// DATA ====================================================================
// =================================================================================

/*
Här är listorna med data (värden från inputs och select) 
som ska sparas i localStorage.
*/

const incomes = [];
const expenses = [];

// "const" låser arrayen, inte innehållet

// =================================================================================
// VARIABLER / QUERY-SELECTORS / DOM-ELEMENT =======================================
// =================================================================================

// Definiera globala variabler som pekar på "Lägg till" knapparna
const addIncomeItemBtn = document.querySelector("#addIncomeItemBtn");
const addExpenseItemBtn = document.querySelector("#addExpenseItemBtn");

// Dropdowns
const incomeCategorySelect = document.querySelector("#incomeCategory");
const expenseCategorySelect = document.querySelector("#expenseCategory");

// input-fälten
const incomeDescriptionInput = document.querySelector("#incomeDescription");
const expenseDescriptionInput = document.querySelector("#expenseDescription");
const incomeAmountInput = document.querySelector("#incomeAmount");
const expenseAmountInput = document.querySelector("#expenseAmount");

// Listor där budgetposter ska renderas
const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

// Balans
const balanceNumber = document.querySelector("#balanceNumber");

// =================================================================================
// EVENT-LYSSNARE ==================================================================
// =================================================================================

// Lyssna efter klick på "Lägg till" knappar
addIncomeItemBtn?.addEventListener("click", createIncomeBudgetPostOnClick);
addExpenseItemBtn?.addEventListener("click", createExpenseBudgetPostOnClick);

// =================================================================================
// FUNKTIONER SOM HANTERAR DATA ====================================================
// =================================================================================

/* Dessa funktioner rör inte DOM
Jobbar med appens minne */

function saveToLocalStorage() {
  // Gör om arrayer till strings (text) och spara dom till localStorage
  localStorage.setItem("incomes", JSON.stringify(incomes));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

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

// =================================================================================
// LOGIK FUNKTIONER ================================================================
// =================================================================================

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

// =================================================================================
// MANIPULERAR DOM-ELEMENT / UI ====================================================
// =================================================================================

/* Dessa rör HTML, använder
textContent, innerHTML, classList */

// Visa på sidan med rätt färg
function renderBalance() {
  /* 
Avbryt funktionen om villkoret är sant.
if-sats --> säkerhetsåtgärd (sidan kan krasha annars)
true = finns inte 
false = finns 
if = Villkoret 
if (..) = Om elementet är true...
return = avbryt
*/
  if (!balanceNumber) return;
  console.log("Balanssumman finns :) ");
  // Kör funktionen som räknar ut balansen och spara resultatet i en variabel
  const balance = calculateBalance();
  // Sätt text i ett befintligt element som finns i html-filen
  balanceNumber.textContent = `Balans: ${balance} kr`;

  // Rensa bort css-färg från äldre beräkning
  balanceNumber.classList.remove(
    "balance-positive",
    "balance-negative",
    "balance-zero"
  );

  // Lägg till rätt färg (class)
  if (balance > 0) {
    // Om balance är positiv -> lägg till klassen med grön färg
    balanceNumber.classList.add("balance-positive");
  } else if (balance < 0) {
    // om balance är negativ -> lägg till klassen med röd färg
    balanceNumber.classList.add("balance-negative");
    // om balance varken är > 0 eller < 0 ...
  } else {
    balanceNumber.classList.add("balance-zero");
  }

  // Jag anropar funktionen varje gång datan som påverkar balansen ändras
}

// Visa i <ul> - (kategori, beskrivning + belopp)
function renderIncomeBudgetPost() {
  if (!incomeList) return;

  console.log("renderIncomeBudgetPost körs");

  // Ingen html tolkas
  /* const li = document.createElement("li");
li.textContent = `${post.description} - ${post.amount}`;
incomeList.appendChild(li); */

  /* const li = document.createElement("li");
const span = document.createElement("span");

span.textContent = `${post.description} - ${post.amount}`;

li.appendChild(span);
incomeList.appendChild(li);*/

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

// Visa options i dropdown
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

// =================================================================================
// INTERAKTION =====================================================================
// =================================================================================

/* Kör kod baserat på användarens inputs och klick 
Det är användaren som triggar funktionerna */

// Skapa post av inmatad data
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
