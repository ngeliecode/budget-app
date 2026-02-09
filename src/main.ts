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

let incomes = [];
let expenses = [];

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

// Tema
const themeToggleBtn = document.querySelector(".theme-toggle");

// =================================================================================
// EVENT-LYSSNARE ==================================================================
// =================================================================================

// Lyssna efter klick på "Lägg till" knappar
addIncomeItemBtn?.addEventListener("click", createIncomeBudgetPostOnClick);
addExpenseItemBtn?.addEventListener("click", createExpenseBudgetPostOnClick);

// Tema
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

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

// Gruppera budgetpost inför rendering
function groupByCategory(posts) {
  // Skapa ett tomt objekt
  const grouped = {};
  // Gå igenom varje budgetpost
  posts.forEach((post) => {
    // Om kategorin inte finns --> skapa den
    if (!grouped[post.categoryValue]) {
      grouped[post.categoryValue] = {
        categoryValue: post.categoryValue,
        categoryText: post.categoryText,
        items: [],
      };
    }
    // Lägg till posten i rätt kategori
    grouped[post.categoryValue].items.push(post);
  });
  // Returnera objektet
  return grouped;
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
  balanceNumber.textContent = `${balance} kr`;

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

// Visa i <ul> - (kategori: beskrivning + belopp)
function renderIncomeBudgetPost() {
  if (!incomeList) return;

  const groupedIncomes = groupByCategory(incomes);
  let html = "";

  Object.values(groupedIncomes).forEach((group) => {
    html += `
      <li class="budgetpost budgetpost--category-${group.categoryValue}">
        <strong>${group.categoryText}</strong>
        <ul>
    `;

    group.items.forEach((item) => {
      html += `
        <li class="budgetpost__item">
          <span class="budgetpost__description">${item.description}</span>
          <span class="budgetpost__amount">${item.amount} kr</span>
          <button
            class="budgetpost__delete_btn"
            data-id="${item.id}"
            aria-label="Radera budgetpost"
          >
            ✕
          </button>
        </li>
      `;
    });

    html += `
        </ul>
      </li>
    `;
  });

  incomeList.innerHTML = html;

  document.querySelectorAll(".budgetpost__delete_btn").forEach((btn) => {
    btn.addEventListener("click", deleteIncomeBudgetPost);
  });
}

function renderExpenseBudgetPost() {
  if (!expenseList) return;

  const groupedExpenses = groupByCategory(expenses);
  let html = "";

  Object.values(groupedExpenses).forEach((group) => {
    html += `
      <li class="budgetpost budgetpost--category-${group.categoryValue}">
        <strong>${group.categoryText}</strong>
        <ul>
    `;

    group.items.forEach((item) => {
      html += `
        <li class="budgetpost__item">
          <span class="budgetpost__description">${item.description}</span>
          <span class="budgetpost__amount">${item.amount} kr</span>
          <button
            class="budgetpost__delete_btn"
            data-id="${item.id}"
            aria-label="Radera budgetpost"
          >
            ✕
          </button>
        </li>
      `;
    });

    html += `
        </ul>
      </li>
    `;
  });

  expenseList.innerHTML = html;

  document.querySelectorAll(".budgetpost__delete_btn").forEach((btn) => {
    btn.addEventListener("click", deleteExpenseBudgetPost);
  });
}

// Visa options från json i dropdown
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
  // 1. läs valt alternativ från dropdown
  const selectedOption =
    incomeCategorySelect.options[incomeCategorySelect.selectedIndex];

  // 2. läs värden från input-fälten och spara värdet i variabler
  const description = incomeDescriptionInput?.value;
  const amount = Number(incomeAmountInput?.value); // inte en sträng

  // 3. Skapa budgetpost
  const budgetPost = {
    id: crypto.randomUUID(), // istället för index och funkar oavsett rendering (gruppering)
    categoryValue: selectedOption.value,
    categoryText: selectedOption.text,
    description,
    amount,
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

  const selectedOption =
    expenseCategorySelect.options[expenseCategorySelect.selectedIndex];
  const description = expenseDescriptionInput?.value;
  const amount = Number(expenseAmountInput?.value);

  const budgetPost = {
    id: crypto.randomUUID(),
    categoryValue: selectedOption.value,
    categoryText: selectedOption.text,
    description,
    amount,
  };

  expenses.push(budgetPost);
  saveToLocalStorage();
  renderExpenseBudgetPost();
  renderBalance();
}

function deleteIncomeBudgetPost(event) {
  console.log("Delete klickad", event.target.dataset.id);
  const id = event.currentTarget.dataset.id;

  incomes = incomes.filter((post) => post.id !== id); // filter istället för splice

  saveToLocalStorage();
  renderIncomeBudgetPost();
  renderBalance();
}

function deleteExpenseBudgetPost(event) {
  console.log("DELETE EXPENSE CLICK", event.target.dataset.id);
  const id = event.currentTarget.dataset.id;

  expenses = expenses.filter((post) => post.id !== id);

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
