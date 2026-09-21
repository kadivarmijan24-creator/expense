"use strict";

/* =========================================================
   KHARCHÉ APP ENGINE
   Offline-first
   ========================================================= */

const STORAGE_KEY = "KHARCHE_PREMIUM_V3";

let state = {
  transactions: [],
  shopping: [],
  budget: 0,
  theme: "light"
};

let currentFilter = "all";

const $ = (selector) => document.querySelector(selector);


/* =========================================================
   SAFE ID
   ========================================================= */

function makeId() {

  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9)
  );
}


/* =========================================================
   STORAGE
   ========================================================= */

function save() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );

  } catch (error) {

    console.error("Save error:", error);

    toast("Could not save data");

  }
}


function load() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const parsed = JSON.parse(saved);

    state = {
      ...state,
      ...parsed,
      transactions:
        Array.isArray(parsed.transactions)
          ? parsed.transactions
          : [],

      shopping:
        Array.isArray(parsed.shopping)
          ? parsed.shopping
          : [],

      budget:
        Number(parsed.budget) || 0
    };

  } catch (error) {

    console.error("Load error:", error);

  }
}


/* =========================================================
   HELPERS
   ========================================================= */

function money(value) {

  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(number);
}


function today() {

  const d = new Date();

  const year =
    d.getFullYear();

  const month =
    String(d.getMonth() + 1).padStart(2, "0");

  const day =
    String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function monthNow() {

  const d = new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
}


function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(date) {

  if (!date) return "";

  const d = new Date(date + "T00:00:00");

  return d.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}


function monthName() {

  return new Date().toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric"
    }
  );
}


function toast(message) {

  const el = $("#toast");

  el.textContent = message;

  el.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {
      el.classList.remove("show");
    }, 2200);
}


/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {

  document.body.classList.toggle(
    "dark",
    state.theme === "dark"
  );
}


function toggleTheme() {

  state.theme =
    state.theme === "dark"
      ? "light"
      : "dark";

  applyTheme();

  save();

  toast(
    state.theme === "dark"
      ? "Dark theme enabled"
      : "Light theme enabled"
  );
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function navigate(page) {

  document
    .querySelectorAll(".page")
    .forEach((element) => {

      element.classList.toggle(
        "active",
        element.id === `${page}Page`
      );

    });


  document
    .querySelectorAll(".nav-item")
    .forEach((element) => {

      element.classList.toggle(
        "active",
        element.dataset.page === page
      );

    });


  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(
  title,
  body,
  eyebrow = "KHARCHÉ"
) {

  $("#modalTitle").textContent = title;

  $("#modalEyebrow").textContent =
    eyebrow;

  $("#modalBody").innerHTML =
    body;

  $("#modal").classList.add("show");
}


function closeModal() {

  $("#modal").classList.remove("show");

  $("#modalBody").innerHTML = "";
}


/* =========================================================
   ICONS
   ========================================================= */

function categoryIcon(category) {

  const icons = {

    Food: "☕",
    Travel: "◆",
    Shopping: "◇",
    Bills: "▣",
    Petrol: "◈",
    Health: "♥",
    Education: "▤",
    Entertainment: "♪",
    "Mom & Home": "⌂",
    Income: "₹",
    Other: "•"

  };

  return icons[category] || "•";
}


/* =========================================================
   ADD EXPENSE
   ========================================================= */

function addExpense(editId = null) {

  const existing =
    state.transactions.find(
      (item) => item.id === editId
    );


  const data =
    existing || {

      title: "",
      amount: "",
      date: today(),
      category: "Food",
      type: "personal",
      note: ""

    };


  openModal(
    editId ? "Edit Expense" : "Add Expense",
    `
      <form id="expenseForm" class="form-grid">

        <div class="form-group">
          <label>EXPENSE NAME</label>
          <input
            class="form-control"
            id="expenseTitle"
            required
            placeholder="e.g. Dinner"
            value="${escapeHTML(data.title)}"
          >
        </div>


        <div class="form-group">
          <label>AMOUNT</label>
          <input
            class="form-control"
            id="expenseAmount"
            required
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value="${data.amount || ""}"
          >
        </div>


        <div class="form-group">
          <label>DATE</label>
          <input
            class="form-control"
            id="expenseDate"
            type="date"
            value="${data.date || today()}"
          >
        </div>


        <div class="form-group">
          <label>CATEGORY</label>

          <select
            class="form-control"
            id="expenseCategory"
          >

            ${[
              "Food",
              "Travel",
              "Shopping",
              "Bills",
              "Petrol",
              "Health",
              "Education",
              "Entertainment",
              "Mom & Home",
              "Other"
            ]
              .map(
                (category) => `
                  <option
                    value="${category}"
                    ${data.category === category ? "selected" : ""}
                  >
                    ${category}
                  </option>
                `
              )
              .join("")}

          </select>
        </div>


        <div class="form-group">
          <label>EXPENSE TYPE</label>

          <select
            class="form-control"
            id="expenseType"
          >

            <option
              value="personal"
              ${data.type === "personal" ? "selected" : ""}
            >
              Personal
            </option>

            <option
              value="home"
              ${data.type === "home" ? "selected" : ""}
            >
              Mom & Home
            </option>

            <option
              value="other"
              ${data.type === "other" ? "selected" : ""}
            >
              Other
            </option>

          </select>
        </div>


        <div class="form-group">
          <label>NOTE</label>

          <textarea
            class="form-control"
            id="expenseNote"
            placeholder="Optional note..."
          >${escapeHTML(data.note || "")}</textarea>
        </div>


        <button class="form-submit" type="submit">
          ${editId ? "Save Changes" : "Save Expense"}
        </button>

      </form>
    `
  );


  $("#expenseForm").addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const title =
        $("#expenseTitle").value.trim();

      const amount =
        Number($("#expenseAmount").value);

      if (!title || !amount || amount < 0) {

        toast("Enter a valid name and amount");

        return;
      }


      const transaction = {

        id: editId || makeId(),

        kind: "expense",

        title,

        amount,

        date:
          $("#expenseDate").value ||
          today(),

        category:
          $("#expenseCategory").value,

        type:
          $("#expenseType").value,

        note:
          $("#expenseNote").value.trim(),

        createdAt:
          existing?.createdAt ||
          Date.now()

      };


      if (editId) {

        state.transactions =
          state.transactions.map(
            (item) =>
              item.id === editId
                ? transaction
                : item
          );

        toast("Expense updated");

      } else {

        state.transactions.unshift(
          transaction
        );

        toast("Expense added");

      }


      save();

      closeModal();

      render();

    }
  );
}


/* =========================================================
   ADD INCOME
   ========================================================= */

function addIncome() {

  openModal(
    "Add Income",
    `
      <form id="incomeForm" class="form-grid">

        <div class="form-group">
          <label>INCOME SOURCE</label>

          <input
            class="form-control"
            id="incomeSource"
            required
            placeholder="e.g. Salary"
          >
        </div>


        <div class="form-group">
          <label>AMOUNT</label>

          <input
            class="form-control"
            id="incomeAmount"
            required
            type="number"
            min="0"
            step="1"
            placeholder="0"
          >
        </div>


        <div class="form-group">
          <label>DATE</label>

          <input
            class="form-control"
            id="incomeDate"
            type="date"
            value="${today()}"
          >
        </div>


        <button
          class="form-submit"
          type="submit"
        >
          Save Income
        </button>

      </form>
    `
  );


  $("#incomeForm").addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const title =
        $("#incomeSource").value.trim();

      const amount =
        Number($("#incomeAmount").value);


      if (!title || !amount || amount < 0) {

        toast("Enter a valid income");

        return;
      }


      state.transactions.unshift({

        id: makeId(),

        kind: "income",

        title,

        amount,

        date:
          $("#incomeDate").value ||
          today(),

        category: "Income",

        type: "other",

        note: "",

        createdAt: Date.now()

      });


      save();

      closeModal();

      render();

      toast("Income added");

    }
  );
}


/* =========================================================
   BUDGET
   ========================================================= */

function setBudget() {

  openModal(
    "Monthly Budget",
    `
      <form id="budgetForm" class="form-grid">

        <div class="form-group">
          <label>MONTHLY LIMIT</label>

          <input
            class="form-control"
            id="budgetInput"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 25000"
            value="${state.budget || ""}"
          >
        </div>

        <button
          class="form-submit"
          type="submit"
        >
          Save Budget
        </button>

      </form>
    `
  );


  $("#budgetForm").addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      state.budget =
        Number($("#budgetInput").value) || 0;

      save();

      closeModal();

      render();

      toast("Budget updated");

    }
  );
}


/* =========================================================
   SHOPPING
   ========================================================= */

function addShopping() {

  openModal(
    "Add Shopping Item",
    `
      <form id="shoppingForm" class="form-grid">

        <div class="form-group">
          <label>ITEM</label>

          <input
            class="form-control"
            id="shoppingName"
            required
            placeholder="e.g. Cooking Oil"
          >
        </div>


        <div class="form-group">
          <label>ESTIMATED PRICE</label>

          <input
            class="form-control"
            id="shoppingPrice"
            type="number"
            min="0"
            step="1"
            placeholder="0"
          >
        </div>


        <div class="form-group">
          <label>QUANTITY</label>

          <input
            class="form-control"
            id="shoppingQuantity"
            type="number"
            min="1"
            value="1"
          >
        </div>


        <div class="form-group">
          <label>CATEGORY</label>

          <select
            class="form-control"
            id="shoppingCategory"
          >

            <option>Mom & Home</option>
            <option>Groceries</option>
            <option>Personal</option>
            <option>Medicine</option>
            <option>Other</option>

          </select>
        </div>


        <button
          class="form-submit"
          type="submit"
        >
          Add Item
        </button>

      </form>
    `
  );


  $("#shoppingForm").addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const name =
        $("#shoppingName").value.trim();

      if (!name) {

        toast("Enter item name");

        return;
      }


      state.shopping.unshift({

        id: makeId(),

        name,

        price:
          Number($("#shoppingPrice").value) || 0,

        quantity:
          Number($("#shoppingQuantity").value) || 1,

        category:
          $("#shoppingCategory").value,

        done: false,

        createdAt: Date.now()

      });


      save();

      closeModal();

      render();

      toast("Shopping item added");

    }
  );
}


function toggleShopping(id) {

  state.shopping =
    state.shopping.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              done: !item.done
            }
          : item
    );

  save();

  render();

}


function deleteShopping(id) {

  if (
    !confirm(
      "Delete this shopping item?"
    )
  ) {
    return;
  }


  state.shopping =
    state.shopping.filter(
      (item) => item.id !== id
    );


  save();

  render();

  toast("Item deleted");
}


/* =========================================================
   TRANSACTION DELETE
   ========================================================= */

function deleteTransaction(id) {

  if (
    !confirm(
      "Delete this transaction?"
    )
  ) {
    return;
  }


  state.transactions =
    state.transactions.filter(
      (item) => item.id !== id
    );


  save();

  render();

  toast("Transaction deleted");
}


/* =========================================================
   TRANSACTION HTML
   ========================================================= */

function transactionHTML(item) {

  const isIncome =
    item.kind === "income";


  const amount =
    isIncome
      ? `+${money(item.amount)}`
      : `-${money(item.amount)}`;


  return `
    <article class="transaction-item">

      <div class="transaction-icon">
        ${categoryIcon(item.category)}
      </div>


      <div class="transaction-main">

        <strong>
          ${escapeHTML(item.title)}
        </strong>

        <small>
          ${escapeHTML(item.category)}
          •
          ${formatDate(item.date)}
        </small>

      </div>


      <div class="transaction-right">

        <div
          class="transaction-amount ${
            isIncome ? "income" : "expense"
          }"
        >
          ${amount}
        </div>


        <div class="transaction-actions">

          <button
            class="mini-button"
            data-edit="${item.id}"
            title="Edit"
          >
            ✎
          </button>

          <button
            class="mini-button"
            data-delete="${item.id}"
            title="Delete"
          >
            ×
          </button>

        </div>

      </div>

    </article>
  `;
}


/* =========================================================
   TOTALS
   ========================================================= */

function getTotals() {

  let income = 0;
  let expense = 0;

  state.transactions.forEach(
    (item) => {

      if (item.kind === "income") {

        income +=
          Number(item.amount) || 0;

      } else {

        expense +=
          Number(item.amount) || 0;

      }

    }
  );


  return {

    income,

    expense,

    balance:
      income - expense

  };
}


function currentMonthExpenses() {

  const month =
    monthNow();

  return state.transactions
    .filter(
      (item) =>
        item.kind === "expense" &&
        String(item.date).startsWith(month)
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );
}


/* =========================================================
   HOME
   ========================================================= */

function renderHome() {

  const totals =
    getTotals();


  $("#currentMonthLabel").textContent =
    monthName();


  $("#totalBalance").textContent =
    money(totals.balance);


  $("#homeIncome").textContent =
    money(totals.income);


  $("#homeExpense").textContent =
    money(totals.expense);


  const monthlyExpense =
    currentMonthExpenses();


  $("#budgetSpent").textContent =
    money(monthlyExpense);


  $("#budgetLimit").textContent =
    money(state.budget);


  const percentage =
    state.budget > 0
      ? Math.min(
          100,
          (monthlyExpense / state.budget) * 100
        )
      : 0;


  $("#budgetProgress").style.width =
    `${percentage}%`;


  $("#budgetText").textContent =
    state.budget
      ? percentage >= 100
        ? "Budget limit reached"
        : `${Math.round(
            percentage
          )}% of your monthly budget used`
      : "Set a monthly budget";


  const recent =
    [...state.transactions]
      .sort(
        (a, b) =>
          (b.createdAt || 0) -
          (a.createdAt || 0)
      )
      .slice(0, 5);


  if (!recent.length) {

    $("#homeTransactions").innerHTML =
      emptyState(
        "No transactions yet",
        "Add your first expense or income."
      );

    return;
  }


  $("#homeTransactions").innerHTML =
    recent
      .map(transactionHTML)
      .join("");
}


/* =========================================================
   TRANSACTIONS PAGE
   ========================================================= */

function renderTransactions() {

  const search =
    ($("#searchInput")?.value || "")
      .trim()
      .toLowerCase();


  let list =
    [...state.transactions];


  if (currentFilter === "expense") {

    list =
      list.filter(
        (item) =>
          item.kind === "expense"
      );

  }


  if (currentFilter === "income") {

    list =
      list.filter(
        (item) =>
          item.kind === "income"
      );

  }


  if (currentFilter === "personal") {

    list =
      list.filter(
        (item) =>
          item.type === "personal"
      );

  }


  if (currentFilter === "home") {

    list =
      list.filter(
        (item) =>
          item.type === "home"
      );

  }


  if (search) {

    list =
      list.filter(
        (item) =>
          `${item.title} ${item.category} ${item.note}`
            .toLowerCase()
            .includes(search)
      );

  }


  list.sort(
    (a, b) =>
      (b.createdAt || 0) -
      (a.createdAt || 0)
  );


  if (!list.length) {

    $("#allTransactions").innerHTML =
      emptyState(
        "Nothing found",
        "Try another search or filter."
      );

    return;
  }


  $("#allTransactions").innerHTML =
    list
      .map(transactionHTML)
      .join("");
}


/* =========================================================
   SHOPPING RENDER
   ========================================================= */

function renderShopping() {

  const pending =
    state.shopping.filter(
      (item) => !item.done
    );


  const amount =
    pending.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
        Number(item.quantity || 1),
      0
    );


  $("#shoppingCount").textContent =
    pending.length;


  $("#shoppingAmount").textContent =
    money(amount);


  if (!state.shopping.length) {

    $("#shoppingItems").innerHTML =
      emptyState(
        "Shopping list is empty",
        "Add something you need to buy."
      );

    return;
  }


  $("#shoppingItems").innerHTML =
    state.shopping
      .map(
        (item) => `

          <div
            class="shopping-item ${
              item.done ? "done" : ""
            }"
          >

            <button
              class="shopping-check"
              data-shopping-toggle="${item.id}"
            >
              ${item.done ? "✓" : ""}
            </button>


            <div class="shopping-info">

              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <small>
                ${escapeHTML(item.category)}
                • Qty ${item.quantity}
              </small>

            </div>


            <div class="shopping-price">
              ${money(
                Number(item.price || 0) *
                Number(item.quantity || 1)
              )}
            </div>


            <button
              class="mini-button"
              data-shopping-delete="${item.id}"
            >
              ×
            </button>

          </div>

        `
      )
      .join("");
}


/* =========================================================
   INSIGHTS
   ========================================================= */

function renderInsights() {

  const expenses =
    state.transactions.filter(
      (item) =>
        item.kind === "expense" &&
        String(item.date)
          .startsWith(monthNow())
    );


  const total =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );


  $("#insightTotal").textContent =
    money(total);


  const categories = {};


  expenses.forEach(
    (item) => {

      categories[item.category] =
        (categories[item.category] || 0) +
        Number(item.amount || 0);

    }
  );


  const rows =
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1]);


  if (!rows.length) {

    $("#categoryChart").innerHTML =
      emptyState(
        "No spending data",
        "Add expenses to see your breakdown."
      );

  } else {

    $("#categoryChart").innerHTML =
      rows
        .map(
          ([category, amount]) => {

            const percent =
              total
                ? (amount / total) * 100
                : 0;


            return `
              <div class="category-row">

                <span>
                  ${escapeHTML(category)}
                </span>

                <div class="category-bar">
                  <div
                    style="width:${percent}%"
                  ></div>
                </div>

                <strong>
                  ${money(amount)}
                </strong>

              </div>
            `;

          }
        )
        .join("");

  }


  const personal =
    expenses
      .filter(
        (item) =>
          item.type === "personal"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );


  const home =
    expenses
      .filter(
        (item) =>
          item.type === "home"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );


  const other =
    expenses
      .filter(
        (item) =>
          item.type === "other"
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0
      );


  $("#personalAmount").textContent =
    money(personal);


  $("#homeAmount").textContent =
    money(home);


  $("#otherAmount").textContent =
    money(other);
}


/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {

  $("#settingsBudgetText").textContent =
    state.budget
      ? `${money(state.budget)} per month`
      : "Not set";
}


/* =========================================================
   EMPTY
   ========================================================= */

function emptyState(
  title,
  description
) {

  return `
    <div class="empty-state">

      <div class="empty-icon">
        ◌
      </div>

      <strong>
        ${escapeHTML(title)}
      </strong>

      <p>
        ${escapeHTML(description)}
      </p>

    </div>
  `;
}


/* =========================================================
   EXPORT
   ========================================================= */

function exportBackup() {

  const data =
    JSON.stringify(
      state,
      null,
      2
    );


  const blob =
    new Blob(
      [data],
      {
        type: "application/json"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    `kharche-backup-${today()}.json`;

  a.click();


  URL.revokeObjectURL(url);

  toast("Backup exported");
}


/* =========================================================
   IMPORT
   ========================================================= */

function importBackup(file) {

  if (!file) return;


  const reader =
    new FileReader();


  reader.onload =
    () => {

      try {

        const data =
          JSON.parse(
            reader.result
          );


        if (
          !data ||
          !Array.isArray(data.transactions) ||
          !Array.isArray(data.shopping)
        ) {

          throw new Error(
            "Invalid backup"
          );

        }


        state = {

          transactions:
            data.transactions,

          shopping:
            data.shopping,

          budget:
            Number(data.budget) || 0,

          theme:
            data.theme === "dark"
              ? "dark"
              : "light"

        };


        save();

        applyTheme();

        render();

        toast("Backup restored successfully");

      } catch (error) {

        console.error(error);

        toast("Invalid backup file");

      }

    };


  reader.readAsText(file);
}


/* =========================================================
   DELETE ALL
   ========================================================= */

function deleteAllData() {

  const first =
    confirm(
      "Delete ALL Kharché data?"
    );


  if (!first) return;


  const second =
    confirm(
      "This cannot be undone. Continue?"
    );


  if (!second) return;


  state = {

    transactions: [],

    shopping: [],

    budget: 0,

    theme: state.theme

  };


  save();

  render();

  toast("All data deleted");
}


/* =========================================================
   EVENT DELEGATION
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {

    const pageButton =
      event.target.closest(
        "[data-page]"
      );


    if (pageButton) {

      navigate(
        pageButton.dataset.page
      );

      return;
    }


    const editButton =
      event.target.closest(
        "[data-edit]"
      );


    if (editButton) {

      addExpense(
        editButton.dataset.edit
      );

      return;
    }


    const deleteButton =
      event.target.closest(
        "[data-delete]"
      );


    if (deleteButton) {

      deleteTransaction(
        deleteButton.dataset.delete
      );

      return;
    }


    const toggleButton =
      event.target.closest(
        "[data-shopping-toggle]"
      );


    if (toggleButton) {

      toggleShopping(
        toggleButton.dataset.shoppingToggle
      );

      return;
    }


    const shoppingDelete =
      event.target.closest(
        "[data-shopping-delete]"
      );


    if (shoppingDelete) {

      deleteShopping(
        shoppingDelete.dataset.shoppingDelete
      );

      return;
    }

  }
);


/* =========================================================
   MAIN BUTTONS
   ========================================================= */

$("#themeButton")
  .addEventListener(
    "click",
    toggleTheme
  );


$("#addExpenseButton")
  .addEventListener(
    "click",
    () => addExpense()
  );


$("#addIncomeButton")
  .addEventListener(
    "click",
    addIncome
  );


$("#setBudgetButton")
  .addEventListener(
    "click",
    setBudget
  );


$("#addShoppingButton")
  .addEventListener(
    "click",
    addShopping
  );


$("#settingsBudgetButton")
  .addEventListener(
    "click",
    setBudget
  );


$("#currencyButton")
  .addEventListener(
    "click",
    () => {

      toast(
        "Currency is set to Indian Rupee ₹"
      );

    }
  );


$("#exportButton")
  .addEventListener(
    "click",
    exportBackup
  );


$("#importButton")
  .addEventListener(
    "click",
    () => {
      $("#importFile").click();
    }
  );


$("#importFile")
  .addEventListener(
    "change",
    (event) => {

      importBackup(
        event.target.files[0]
      );

      event.target.value = "";

    }
  );


$("#deleteDataButton")
  .addEventListener(
    "click",
    deleteAllData
  );


$("#closeModal")
  .addEventListener(
    "click",
    closeModal
  );


$("#modal")
  .addEventListener(
    "click",
    (event) => {

      if (
        event.target.id === "modal"
      ) {
        closeModal();
      }

    }
  );


$("#searchInput")
  .addEventListener(
    "input",
    renderTransactions
  );


document
  .querySelectorAll(".filter")
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          currentFilter =
            button.dataset.filter;


          document
            .querySelectorAll(".filter")
            .forEach(
              (item) =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          renderTransactions();

        }
      );

    }
  );


/* =========================================================
   RENDER
   ========================================================= */

function render() {

  renderHome();

  renderTransactions();

  renderShopping();

  renderInsights();

  renderSettings();

}


/* =========================================================
   START
   ========================================================= */

load();

applyTheme();

render();


/* =========================================================
   OFFLINE SERVICE WORKER
   ========================================================= */

if (
  "serviceWorker" in navigator &&
  (
    location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
  )
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .catch(
          (error) =>
            console.log(
              "Service worker:",
              error
            )
        );

    }
  );

}