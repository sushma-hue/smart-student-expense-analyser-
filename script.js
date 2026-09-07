let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let initialBalance =
    Number(localStorage.getItem("initialBalance")) || 0;

let addedMoney = Number(localStorage.getItem("addedMoney")) || 0;

let balance = document.querySelector("#balance");
let expense = document.querySelector("#category");
let amount = document.querySelector("#amount");
let date = document.querySelector("#date");
let button = document.querySelector(".btn");
let addMoneyInput = document.querySelector("#addMoney");
let addBtn = document.querySelector("#addBtn");

// ---------------- ADD MONEY ----------------
addBtn.addEventListener("click", function () {
    let addedAmount = Number(addMoneyInput.value);
    addedMoney += addedAmount;
    localStorage.setItem("addedMoney", addedMoney);
    updateBalance();
    addMoneyInput.value = ""; // Clear the input field after adding money
});
                                
// ---------------- UPDATE BALANCE ----------------

function updateBalance() {
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total = total + Number(expenses[i].amount);
    }

    let finalBalance = initialBalance + addedMoney - total;

    console.log("The Total expense is", total);

    document.querySelector("#totalAmount").innerHTML =
        `Total Expense: ${total}Rs`;

    document.querySelector("#finalBalance").innerHTML =
        `Final Balance: ${finalBalance}Rs`;

    document.querySelector("#initialBalance").innerHTML =
        `Initial Balance: ${initialBalance}Rs`;
}


// ---------------- RENDER EXPENSES ----------------

function renderExpenses() {

    // Remove old expense rows
    document.querySelectorAll(".expense-item").forEach(function (expenseItem) {
        expenseItem.remove();
    });


    // Create current expense rows
    for (let i = 0; i < expenses.length; i++) {

        let eachExpense = document.createElement("div");
        eachExpense.className = "expense-item";


        // Create Delete button
        let deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.innerHTML = "Delete";

        // Remember which expense this button belongs to
        deleteButton.dataset.index = i;


        // Delete button
        deleteButton.addEventListener("click", function () {

            let index = Number(this.dataset.index);

            expenses.splice(index, 1);

            localStorage.setItem(
                "expenses",
                JSON.stringify(expenses)
            );

            renderExpenses();
            calculateHighestExpense();
        });


        // Display expense
        eachExpense.innerHTML =
            `Expenses: ${expenses[i].expense} -- ${expenses[i].amount}Rs -- On ${expenses[i].date}`;

        eachExpense.append(deleteButton);

        document.querySelector("body").append(eachExpense);
    }


    updateBalance();
}


// ---------------- SUBMIT BUTTON ----------------

button.addEventListener("click", function () {

    // Add expense to array
    expenses.push({
        expense: expense.value,
        amount: amount.value,
        date: date.value
    });


    // Save expenses
    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    // Save initial balance only the first time
    if (localStorage.getItem("initialBalance") === null) {

        initialBalance = Number(balance.value);

        localStorage.setItem(
            "initialBalance",
            Number(initialBalance)
        );
    }


    // Display all expenses again
    renderExpenses();
    calculateHighestExpense();

    // Clear inputs
    expense.value = "";
    amount.value = "";
    date.value = "";

});


// ----------------Highest Expense calculation----------------
function calculateHighestExpense() {
let categoryTotal = {};
if (expenses.length === 0) {
    document.querySelector("#highestExpense").innerHTML = "No expenses recorded.";
    return;
}
for (let i = 0; i < expenses.length; i++) {
    let category = expenses[i].expense;
    let amount = Number(expenses[i].amount);

    if (categoryTotal[category]) {
        categoryTotal[category] += amount;
    } else {
        categoryTotal[category] = amount;
    }
}

let highestCategory = Object.keys(categoryTotal).reduce((a, b) => categoryTotal[a] > categoryTotal[b] ? a : b);
let highestAmount = categoryTotal[highestCategory];

console.log(`The highest expense is in the ${highestCategory} category with a total of ${highestAmount}Rs.`);

// Display highest spent category 
document.querySelector("#highestExpense").innerHTML= `The highest spending Category: ${highestCategory} -- ${highestAmount}Rs`;
}    

// ---------------- PAGE LOAD ----------------
calculateHighestExpense();
renderExpenses();
