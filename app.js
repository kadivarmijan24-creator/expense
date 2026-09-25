/* =========================================
   DAILY APP
   Expenses + Wallet + Shopping
========================================= */

const STORAGE_KEY = "daily_expense_app_v4";


let state = {

    expenses: [],

    shopping: [],

    moneyAdded: []

};


let currentFilter = "all";

let selectedCategory = "Food";


/* =========================================
   STORAGE
========================================= */

function loadData() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            state.expenses =
                Array.isArray(parsed.expenses)
                    ? parsed.expenses
                    : [];


            state.shopping =
                Array.isArray(parsed.shopping)
                    ? parsed.shopping
                    : [];


            state.moneyAdded =
                Array.isArray(parsed.moneyAdded)
                    ? parsed.moneyAdded
                    : [];

        }


        /*
          Old version migration
          If user already had v3 data,
          import it automatically.
        */

        if (
            !saved &&
            localStorage.getItem(
                "daily_expense_app_v3"
            )
        ) {

            const old =
                JSON.parse(
                    localStorage.getItem(
                        "daily_expense_app_v3"
                    )
                );


            state.expenses =
                Array.isArray(old.expenses)
                    ? old.expenses
                    : [];


            state.shopping =
                Array.isArray(old.shopping)
                    ? old.shopping
                    : [];


            state.moneyAdded = [];

            saveData();
        }

    } catch (error) {

        console.error(
            "Could not load data:",
            error
        );

    }
}


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}


/* =========================================
   HELPERS
========================================= */

function createId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


/*
  Display format:
  DD/MM/YYYY
*/

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const parts =
        dateString.split("-");


    if (parts.length === 3) {

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }


    return dateString;
}


function formatMoney(amount) {

    const number =
        Number(amount) || 0;


    return "₹" +
        number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
}


function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


function getCategoryIcon(category) {

    const icons = {

        Food: "🍴",

        Travel: "🚗",

        Shopping: "🛍",

        Bills: "◈",

        Other: "•"

    };


    return (
        icons[category] ||
        "•"
    );
}


function isSameMonth(dateString) {

    if (!dateString) {
        return false;
    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    const now =
        new Date();


    return (

        date.getMonth() ===
        now.getMonth()

        &&

        date.getFullYear() ===
        now.getFullYear()

    );
}


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


/* =========================================
   CONFIRM DELETE
========================================= */

function confirmDelete(message) {

    return window.confirm(
        message
    );
}


/* =========================================
   NAVIGATION
========================================= */

function openPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            pageId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.page ===
                pageId
            );

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   MODALS
========================================= */

function openModal(modalId) {

    const modal =
        document.getElementById(
            modalId
        );


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";
}


function closeModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";
}


function closeAllModals() {

    document
        .querySelectorAll(
            ".modal.show"
        )
        .forEach(modal => {

            closeModal(
                modal
            );

        });
}


/* =========================================
   EXPENSE MODAL
========================================= */

function openExpenseModal() {

    document
        .getElementById(
            "expenseForm"
        )
        .reset();


    document.getElementById(
        "expenseDate"
    ).value =
        getToday();


    selectedCategory =
        "Food";


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.category ===
                selectedCategory
            );

        });


    openModal(
        "expenseModal"
    );


    setTimeout(
        () => {

            document
                .getElementById(
                    "expenseAmount"
                )
                .focus();

        },
        250
    );
}


/* =========================================
   ADD EXPENSE
========================================= */

function addExpense(event) {

    event.preventDefault();


    const amount =
        Number(
            document
                .getElementById(
                    "expenseAmount"
                )
                .value
        );


    const title =
        document
            .getElementById(
                "expenseTitle"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "expenseDate"
            )
            .value;


    if (
        !amount ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount"
        );

        return;
    }


    if (!title) {

        showToast(
            "Enter what you spent on"
        );

        return;
    }


    /*
      Check wallet balance
    */

    const available =
        getAvailableBalance();


    if (amount > available) {

        showToast(
            "Insufficient balance. Add money first."
        );

        return;
    }


    /*
      IMPORTANT:
      Only this function creates expenses.
      Shopping is completely separate.
    */

    state.expenses.unshift({

        id:
            createId(),

        amount:
            amount,

        title:
            title,

        category:
            selectedCategory,

        date:
            date || getToday(),

        createdAt:
            Date.now()

    });


    saveData();


    closeAllModals();


    renderAll();


    showToast(
        "Expense saved"
    );
}


/* =========================================
   DELETE EXPENSE
========================================= */

function deleteExpense(id) {

    const expense =
        state.expenses.find(
            item =>
                item.id === id
        );


    if (!expense) {
        return;
    }


    const confirmed =
        confirmDelete(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmed) {
        return;
    }


    state.expenses =
        state.expenses.filter(
            item =>
                item.id !== id
        );


    saveData();


    renderAll();


    showToast(
        "Expense deleted"
    );
}


/* =========================================
   CREATE EXPENSE ELEMENT
========================================= */

function createExpenseElement(
    expense
) {

    const item =
        document.createElement(
            "div"
        );


    item.className =
        "expense-item";


    item.innerHTML = `

        <div class="expense-icon">
            ${getCategoryIcon(
                expense.category
            )}
        </div>

        <div class="expense-info">

            <strong>
                ${escapeHTML(
                    expense.title
                )}
            </strong>

            <small>
                ${escapeHTML(
                    expense.category
                )}
                •
                ${formatDate(
                    expense.date
                )}
            </small>

        </div>

        <div class="expense-right">

            <span class="expense-amount">
                ${formatMoney(
                    expense.amount
                )}
            </span>

            <button
                class="delete-btn delete-expense"
                title="Delete expense"
                data-id="${expense.id}">
                ×
            </button>

        </div>
    `;


    return item;
}


/* =========================================
   RENDER RECENT EXPENSES
========================================= */

function renderRecentExpenses() {

    const container =
        document.getElementById(
            "recentExpenses"
        );


    container.innerHTML =
        "";


    const recent =
        [...state.expenses]
            .sort(
                (a, b) =>
                    (b.createdAt || 0) -
                    (a.createdAt || 0)
            )
            .slice(
                0,
                5
            );


    recent.forEach(
        expense => {

            container.appendChild(
                createExpenseElement(
                    expense
                )
            );

        }
    );
}


/* =========================================
   RENDER EXPENSES
========================================= */

function renderExpenses() {

    const container =
        document.getElementById(
            "expensesList"
        );


    container.innerHTML =
        "";


    let expenses =
        [...state.expenses]
            .sort(
                (a, b) =>
                    (b.createdAt || 0) -
                    (a.createdAt || 0)
            );


    if (
        currentFilter !==
        "all"
    ) {

        expenses =
            expenses.filter(
                expense =>
                    expense.category ===
                    currentFilter
            );

    }


    const empty =
        document.getElementById(
            "expensesEmpty"
        );


    if (
        expenses.length === 0
    ) {

        empty.classList.remove(
            "hidden"
        );

        return;

    }


    empty.classList.add(
        "hidden"
    );


    expenses.forEach(
        expense => {

            container.appendChild(
                createExpenseElement(
                    expense
                )
            );

        }
    );
}


/* =========================================
   WALLET
========================================= */

function getTotalAdded() {

    return state.moneyAdded.reduce(
        (sum, item) =>
            sum +
            Number(item.amount || 0),
        0
    );
}


function getTotalSpent() {

    return state.expenses.reduce(
        (sum, item) =>
            sum +
            Number(item.amount || 0),
        0
    );
}


function getAvailableBalance() {

    return (
        getTotalAdded() -
        getTotalSpent()
    );
}


function openMoneyModal() {

    document
        .getElementById(
            "moneyForm"
        )
        .reset();


    openModal(
        "moneyModal"
    );


    setTimeout(
        () => {

            document
                .getElementById(
                    "moneyAmount"
                )
                .focus();

        },
        250
    );
}


function addMoney(event) {

    event.preventDefault();


    const amount =
        Number(
            document
                .getElementById(
                    "moneyAmount"
                )
                .value
        );


    const note =
        document
            .getElementById(
                "moneyNote"
            )
            .value
            .trim();


    if (
        !amount ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount"
        );

        return;
    }


    state.moneyAdded.push({

        id:
            createId(),

        amount:
            amount,

        note:
            note || "Money added",

        date:
            getToday(),

        createdAt:
            Date.now()

    });


    saveData();


    closeAllModals();


    renderAll();


    showToast(
        "Money added successfully"
    );
}


function renderWallet() {

    const totalAdded =
        getTotalAdded();


    const totalSpent =
        getTotalSpent();


    const balance =
        getAvailableBalance();


    document.getElementById(
        "totalAdded"
    ).textContent =
        formatMoney(
            totalAdded
        );


    document.getElementById(
        "totalSpent"
    ).textContent =
        formatMoney(
            totalSpent
        );


    document.getElementById(
        "availableBalance"
    ).textContent =
        formatMoney(
            balance
        );


    /*
      If balance becomes negative
      for old imported data, still show
      the actual amount.
    */

    const balanceElement =
        document.getElementById(
            "availableBalance"
        );


    balanceElement.style.color =
        balance < 0
            ? "#E6A29A"
            : "";
}


/* =========================================
   SHOPPING
========================================= */

function openShoppingModal() {

    document
        .getElementById(
            "shoppingForm"
        )
        .reset();


    openModal(
        "shoppingModal"
    );


    setTimeout(
        () => {

            document
                .getElementById(
                    "shoppingName"
                )
                .focus();

        },
        250
    );
}


function addShopping(
    name,
    price = 0
) {

    name =
        String(
            name || ""
        ).trim();


    if (!name) {

        showToast(
            "Enter an item"
        );

        return false;
    }


    /*
      IMPORTANT:
      Shopping items do NOT affect wallet.
    */

    state.shopping.push({

        id:
            createId(),

        name:
            name,

        price:
            Number(price) || 0,

        completed:
            false,

        createdAt:
            Date.now()

    });


    saveData();


    renderAll();


    return true;
}


function handleShoppingForm(
    event
) {

    event.preventDefault();


    const name =
        document
            .getElementById(
                "shoppingName"
            )
            .value;


    const price =
        document
            .getElementById(
                "shoppingPrice"
            )
            .value;


    if (
        addShopping(
            name,
            price
        )
    ) {

        closeAllModals();


        showToast(
            "Added to shopping list"
        );
    }
}


function quickAddShopping() {

    const input =
        document.getElementById(
            "quickShoppingInput"
        );


    const name =
        input.value.trim();


    if (!name) {

        input.focus();

        return;
    }


    if (
        addShopping(
            name,
            0
        )
    ) {

        input.value =
            "";


        showToast(
            "Added to shopping list"
        );
    }
}


/* =========================================
   RENDER SHOPPING
========================================= */

function renderShopping() {

    const container =
        document.getElementById(
            "shoppingList"
        );


    container.innerHTML =
        "";


    const sorted =
        [...state.shopping]
            .sort(
                (a, b) => {

                    if (
                        a.completed !==
                        b.completed
                    ) {

                        return a.completed
                            ? 1
                            : -1;
                    }


                    return (
                        (b.createdAt || 0) -
                        (a.createdAt || 0)
                    );

                }
            );


    const empty =
        document.getElementById(
            "shoppingEmpty"
        );


    if (
        sorted.length === 0
    ) {

        empty.classList.remove(
            "hidden"
        );

    } else {

        empty.classList.add(
            "hidden"
        );
    }


    sorted.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "shopping-item" +
                (
                    item.completed
                        ? " completed"
                        : ""
                );


            element.innerHTML = `

                <button
                    class="shopping-check"
                    data-id="${item.id}">
                    ${
                        item.completed
                            ? "✓"
                            : ""
                    }
                </button>

                <span class="shopping-name">
                    ${escapeHTML(
                        item.name
                    )}
                </span>

                ${
                    Number(item.price) > 0
                        ? `
                        <span class="shopping-price">
                            ${formatMoney(
                                item.price
                            )}
                        </span>
                        `
                        : ""
                }

                <button
                    class="delete-btn delete-shopping"
                    data-id="${item.id}">
                    ×
                </button>
            `;


            container.appendChild(
                element
            );

        }
    );


    updateShoppingSummary();
}


/* =========================================
   SHOPPING TOGGLE
========================================= */

function toggleShopping(id) {

    const item =
        state.shopping.find(
            item =>
                item.id === id
        );


    if (!item) {
        return;
    }


    item.completed =
        !item.completed;


    saveData();


    renderAll();
}


/* =========================================
   DELETE SHOPPING
========================================= */

function deleteShopping(id) {

    const item =
        state.shopping.find(
            entry =>
                entry.id === id
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirmDelete(
            "Are you sure you want to delete this shopping item?"
        );


    if (!confirmed) {
        return;
    }


    state.shopping =
        state.shopping.filter(
            entry =>
                entry.id !== id
        );


    saveData();


    renderAll();


    showToast(
        "Shopping item deleted"
    );
}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const today =
        getToday();


    const todayExpenses =
        state.expenses.filter(
            expense =>
                expense.date ===
                today
        );


    const todayTotal =
        todayExpenses.reduce(
            (sum, expense) =>
                sum +
                Number(
                    expense.amount
                ),
            0
        );


    const monthTotal =
        state.expenses
            .filter(
                expense =>
                    isSameMonth(
                        expense.date
                    )
            )
            .reduce(
                (sum, expense) =>
                    sum +
                    Number(
                        expense.amount
                    ),
                0
            );


    document.getElementById(
        "todayTotal"
    ).textContent =
        formatMoney(
            todayTotal
        );


    document.getElementById(
        "todayTransactions"
    ).textContent =
        todayExpenses.length;


    document.getElementById(
        "todayShopping"
    ).textContent =
        state.shopping.filter(
            item =>
                !item.completed
        ).length;


    document.getElementById(
        "monthTotal"
    ).textContent =
        formatMoney(
            monthTotal
        );


    const homeEmpty =
        document.getElementById(
            "homeEmpty"
        );


    if (
        state.expenses.length === 0
    ) {

        homeEmpty.classList.remove(
            "hidden"
        );

    } else {

        homeEmpty.classList.add(
            "hidden"
        );
    }
}


/* =========================================
   SHOPPING SUMMARY
========================================= */

function updateShoppingSummary() {

    const remaining =
        state.shopping.filter(
            item =>
                !item.completed
        ).length;


    const completed =
        state.shopping.filter(
            item =>
                item.completed
        ).length;


    const total =
        state.shopping.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.price || 0
                ),
            0
        );


    document.getElementById(
        "shoppingRemaining"
    ).textContent =
        remaining;


    document.getElementById(
        "shoppingCompleted"
    ).textContent =
        completed;


    document.getElementById(
        "shoppingTotal"
    ).textContent =
        formatMoney(
            total
        );
}


/* =========================================
   INSIGHTS
========================================= */

function renderInsights() {

    const monthExpenses =
        state.expenses.filter(
            expense =>
                isSameMonth(
                    expense.date
                )
        );


    const total =
        monthExpenses.reduce(
            (sum, expense) =>
                sum +
                Number(
                    expense.amount
                ),
            0
        );


    document.getElementById(
        "insightMonthTotal"
    ).textContent =
        formatMoney(
            total
        );


    const categories = [

        "Food",

        "Travel",

        "Shopping",

        "Bills",

        "Other"

    ];


    const container =
        document.getElementById(
            "categoryStats"
        );


    container.innerHTML =
        "";


    categories.forEach(
        category => {

            const categoryTotal =
                monthExpenses
                    .filter(
                        expense =>
                            expense.category ===
                            category
                    )
                    .reduce(
                        (sum, expense) =>
                            sum +
                            Number(
                                expense.amount
                            ),
                        0
                    );


            const percentage =
                total > 0
                    ? Math.min(
                        100,
                        (
                            categoryTotal /
                            total
                        ) * 100
                    )
                    : 0;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            row.innerHTML = `

                <div class="category-top">

                    <span class="category-name">
                        ${getCategoryIcon(
                            category
                        )}
                        ${category}
                    </span>

                    <span class="category-value">
                        ${formatMoney(
                            categoryTotal
                        )}
                    </span>

                </div>

                <div class="progress">

                    <div
                        style="width:${percentage}%">
                    </div>

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );
}


/* =========================================
   RENDER ALL
========================================= */

function renderAll() {

    renderWallet();

    renderRecentExpenses();

    renderExpenses();

    renderShopping();

    updateDashboard();

    renderInsights();
}


/* =========================================
   EVENTS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();


        /* Entry animation */

        setTimeout(
            () => {

                const entry =
                    document.getElementById(
                        "entryScreen"
                    );


                const app =
                    document.getElementById(
                        "mainApp"
                    );


                entry.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        entry.style.display =
                            "none";


                        app.classList.remove(
                            "hidden"
                        );

                    },
                    350
                );

            },
            1300
        );


        /* Navigation */

        document
            .querySelectorAll(
                ".nav-item"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        () => {

                            openPage(
                                item.dataset.page
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(
                button => {

                    if (
                        !button.classList.contains(
                            "nav-item"
                        )
                    ) {

                        button.addEventListener(
                            "click",
                            () => {

                                openPage(
                                    button.dataset.page
                                );

                            }
                        );

                    }

                }
            );


        /* Expense */

        document
            .querySelectorAll(
                ".expense-action"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        openExpenseModal
                    );

                }
            );


        document
            .getElementById(
                "headerAddBtn"
            )
            .addEventListener(
                "click",
                openExpenseModal
            );


        /* Wallet */

        document
            .getElementById(
                "addMoneyBtn"
            )
            .addEventListener(
                "click",
                openMoneyModal
            );


        document
            .getElementById(
                "moneyForm"
            )
            .addEventListener(
                "submit",
                addMoney
            );


        /* Shopping */

        document
            .querySelectorAll(
                ".shopping-action"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        openShoppingModal
                    );

                }
            );


        /* Category */

        document
            .querySelectorAll(
                ".category-btn"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            selectedCategory =
                                button.dataset.category;


                            document
                                .querySelectorAll(
                                    ".category-btn"
                                )
                                .forEach(
                                    btn => {

                                        btn.classList.toggle(
                                            "active",
                                            btn ===
                                            button
                                        );

                                    }
                                );

                        }
                    );

                }
            );


        /* Expense form */

        document
            .getElementById(
                "expenseForm"
            )
            .addEventListener(
                "submit",
                addExpense
            );


        /* Shopping form */

        document
            .getElementById(
                "shoppingForm"
            )
            .addEventListener(
                "submit",
                handleShoppingForm
            );


        /* Quick shopping */

        document
            .getElementById(
                "quickShoppingBtn"
            )
            .addEventListener(
                "click",
                quickAddShopping
            );


        document
            .getElementById(
                "quickShoppingInput"
            )
            .addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        quickAddShopping();

                    }

                }
            );


        /* Close modals */

        document
            .querySelectorAll(
                ".close-modal"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            closeModal(
                                button.closest(
                                    ".modal"
                                )
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".modal-backdrop"
            )
            .forEach(
                backdrop => {

                    backdrop.addEventListener(
                        "click",
                        () => {

                            closeModal(
                                backdrop.closest(
                                    ".modal"
                                )
                            );

                        }
                    );

                }
            );


        /* Filters */

        document
            .querySelectorAll(
                ".filter"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            currentFilter =
                                button.dataset.filter;


                            document
                                .querySelectorAll(
                                    ".filter"
                                )
                                .forEach(
                                    btn => {

                                        btn.classList.toggle(
                                            "active",
                                            btn ===
                                            button
                                        );

                                    }
                                );


                            renderExpenses();

                        }
                    );

                }
            );


        /* Delete / shopping */

        document.addEventListener(
            "click",
            event => {

                const deleteExpenseButton =
                    event.target.closest(
                        ".delete-expense"
                    );


                if (
                    deleteExpenseButton
                ) {

                    deleteExpense(
                        deleteExpenseButton
                            .dataset
                            .id
                    );

                    return;
                }


                const deleteShoppingButton =
                    event.target.closest(
                        ".delete-shopping"
                    );


                if (
                    deleteShoppingButton
                ) {

                    deleteShopping(
                        deleteShoppingButton
                            .dataset
                            .id
                    );

                    return;
                }


                const shoppingCheck =
                    event.target.closest(
                        ".shopping-check"
                    );


                if (
                    shoppingCheck
                ) {

                    toggleShopping(
                        shoppingCheck
                            .dataset
                            .id
                    );

                }

            }
        );


        /* Date */

        document.getElementById(
            "expenseDate"
        ).value =
            getToday();


        /* Initial render */

        renderAll();


        /* Offline */

        if (
            "serviceWorker" in
            navigator
        ) {

            window.addEventListener(
                "load",
                () => {

                    navigator
                        .serviceWorker
                        .register(
                            "./sw.js"
                        )
                        .then(
                            () => {

                                console.log(
                                    "Offline mode ready"
                                );

                            }
                        )
                        .catch(
                            error => {

                                console.log(
                                    "Service worker error:",
                                    error
                                );

                            }
                        );

                }
            );

        }

    }
);