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
const balanceNumber = document.querySelector("#balanceNumber");

// =================================================================================
// EVENT-LYSSNARE ==================================================================
// =================================================================================

// Lyssna efter klick på "Lägg till" knappar
addIncomeItemBtn?.addEventListener("click", createIncomeBudgetPostOnClick);
addExpenseItemBtn?.addEventListener("click", createExpenseBudgetPostOnClick);

// =================================================================================
// LOGIK FUNKTIONER ================================================================
// =================================================================================

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

// =================================================================================
// FUNKTIONER SOM MANIPULERAR HTML =================================================
// =================================================================================

// Rendera balansen (visa den på sidan och sätt rätt färg)
function renderBalance() {
  /* Avbryt funktionen om villkoret är sant.
true = finns inte (null eller undefined?)
false = finns 
! = truthy/falsy?? Skyddar mot allt?
if = Villkoret 
if (..) = Om elementet är true...
return = avbryt
if-sats --> säkerhetsåtgärd (sidan kan krasha annars)
=== strict equality = Om två nånting är lika returneras true? Skyddar inte mot allt?
Jag borde ha if + return på alla funktioner som manipulerar dom-element? Ja. 
intern data -> lever i minnet?
*/
  if (!balanceNumber) return;
  console.log("Balanssumman finns :) ");
  // Kör funktionen som räknar ut balansen och spara resultatet i en variabel
  const balance = calculateBalance();

  /*
  textContent = egenskap på dom-element (varför inte innerHTML? 
  För att texten kommer från användaren. 
  balanceNumber.textContent = `Balans: ${balance} kr`;
  
  innerHTML = "parses its input as HTML" (injektion!)
  textContent = Bara text?Använd när... 
  innerText =  "takes CSS styles into account" */

  /*eftersom balanceNumber pekar på ett dom-element 

<p id=balanceNumber><!--- funktionen renderBalance renderar ut ett nummer som calculateBalance har kommit fram till/manipulerar numret som redan finns--></p>

vart är kopplingen till inputs?*/

  /*
  // Ta bort gamla klasser
  balanceEl.classList.remove(
    "balance-positive",
    "balance-negative",
    "balance-zero"
  );

  // Lägg till rätt klass
  if (balance > 0) {
    balanceEl.classList.add("balance-positive");
  } else if (balance < 0) {
    balanceEl.classList.add("balance-negative");
  } else {
    balanceEl.classList.add("balance-zero");
  }*/

  // Jag anropar funktionen då..
}

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
