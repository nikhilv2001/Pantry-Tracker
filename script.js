document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list-body");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const searchInput = document.getElementById("search-input");
    let expenses = [];

    // Retrieve expenses from local storage
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        displayExpenses(expenses);
        updateTotalAmount();
    }

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("expense-name").value;
        const amount = parseInt(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;
        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };
        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        expenseForm.reset();

        // Save expenses to local storage
        localStorage.setItem("expenses", JSON.stringify(expenses));
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();

            // Save expenses to local storage
            localStorage.setItem("expenses", JSON.stringify(expenses));
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);
            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;
            expenseForm.dataset.id = id;
        }
    });

    filterCategory.addEventListener("change", () => {
        const category = filterCategory.value;
        const filteredExpenses = expenses.filter(expense => expense.category === category || category === "All");
        displayExpenses(filteredExpenses);
    });

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredExpenses = expenses.filter(expense => expense.name.toLowerCase().includes(searchTerm));
        displayExpenses(filteredExpenses);
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        totalAmount.textContent = `Total Items: ${total}`;
    }
});