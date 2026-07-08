

document.getElementById("ExpenseForm").addEventListener("submit", addExpense);

async function addExpense(e) {
  e.preventDefault();
  const expenseData = {
    expenseAmount: document.getElementById("expense").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    
  };
  try {
   
    // save expense 
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:4000/expense/addExpense", expenseData, {
      headers: { Authorization: token },
    });
    //showOnScreen(response.data);
    await getExpenses(1);
  } catch (error) {
    console.log(error);
  }
}

function showOnScreen(expense) {
  const parent = document.getElementById("expenseList");
  const card = document.createElement("div");
  card.className = "expense-card";
  card.innerHTML = `
    <h3>₹${expense.expenseAmount}</h3>
    <p>${expense.description}</p>
    <span>${expense.category}</span>
  `;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", async () => {
    try {
      await axios.delete(`http://localhost:4000/expense/deleteExpense/${expense.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      parent.removeChild(card);
    } catch (error) {
      console.log(error);
    }
  });
  card.appendChild(deleteBtn);
  parent.appendChild(card);
}

// window.addEventListener("DOMContentLoaded", async () => {
//   try {
   
//     const token = localStorage.getItem("token");

// const payload = JSON.parse(atob(token.split(".")[1]));

// const premiumBtn = document.getElementById("premiumBtn");


// const premiumSection = document.getElementById("premiumSection");
// const leaderboardBtn = document.getElementById("leaderboardBtn");

// if (payload.isPremiumUser) {
//     premiumBtn.style.display = "none";
//     premiumSection.style.display = "flex";
// } else {
//     premiumBtn.style.display = "inline-block";
//     premiumSection.style.display = "none";
// }
//     const response = await axios.get("http://localhost:4000/expense/getExpense", {
//       headers: { Authorization: token },
//     });
//     response.data.forEach((element) => showOnScreen(element));
//   } catch (error) {
//     console.log(error);
//   }

//   // Pehle URL se try karo
//   const urlParams = new URLSearchParams(window.location.search);
//   let orderId = urlParams.get("order_id");

//   // Nahi mila to localStorage se lo
//   if (!orderId) {
//     orderId = localStorage.getItem("pendingOrderId");
//   }

//   if (orderId) {
//     localStorage.removeItem("pendingOrderId");
//     await verifyAndShowResult(orderId);
//     window.history.replaceState({}, document.title, window.location.pathname);
//   }
// });
window.addEventListener("DOMContentLoaded", async () => {
    try {

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("payload:",payload);
        const premiumBtn = document.getElementById("premiumBtn");
        const premiumSection = document.getElementById("premiumSection");
        const premiumFeatures = document.getElementById("premiumFeatures");

        // Premium UI
        if (payload.isPremiumUser) {
            premiumBtn.style.display = "none";
            premiumSection.style.display = "flex";

            if (premiumFeatures) {
                premiumFeatures.style.display = "block";
            }

        } else {
            premiumBtn.style.display = "inline-block";
            premiumSection.style.display = "none";

            if (premiumFeatures) {
                premiumFeatures.style.display = "none";
            }
        }

        // Load Expenses

        // const response = await axios.get(
        //     "http://localhost:4000/expense/getExpense",
        //     {
        //         headers: {
        //             Authorization: token
        //         }
        //     }
        // );

        // response.data.forEach((expense) => {
        //     showOnScreen(expense);
        // });
        await getExpenses(1);

    } catch (error) {
        console.log(error);
    }

    // Payment Verification
    const urlParams = new URLSearchParams(window.location.search);

    let orderId = urlParams.get("order_id");

    if (!orderId) {
        orderId = localStorage.getItem("pendingOrderId");
    }

    if (orderId) {
        localStorage.removeItem("pendingOrderId");

        await verifyAndShowResult(orderId);

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }
});
async function getExpenses(page = 1) {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:4000/expense/getExpense?page=${page}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        document.getElementById("expenseList").innerHTML = "";

        response.data.expenses.forEach(expense => {
            showOnScreen(expense);
        });

        showPagination(response.data);

    } catch (err) {
        console.log(err);
    }
}

async function buyPremium() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:4000/premium/BuyPremium", {
      headers: { Authorization: token },
    });

    //  order_id bhi destructure karo
    const { payment_session_id, order_id } = response.data;
    localStorage.setItem("pendingOrderId", order_id);

    const cashfree = Cashfree({ mode: "sandbox" });
    cashfree.checkout({
      paymentSessionId: payment_session_id,
      redirectTarget: "_self",
    });
  } catch (error) {
    console.log("Buy Premium Error:", error);
    alert("Something went wrong. Please try again.");
  }
}

async function verifyAndShowResult(orderId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:4000/premium/verifyPayment",
      { orderId },
      { headers: { Authorization: token } }
    );

    if (response.data.success) {

  localStorage.setItem("token", response.data.token);

  
  const premiumBtn = document.getElementById("premiumBtn");
const premiumSection = document.getElementById("premiumSection");

premiumBtn.style.display = "none";
premiumSection.style.display = "flex";

  alert(" Transaction Successful! You are now a Premium Member.");

} else {
  alert("❌ TRANSACTION FAILED. Please try again.");
}
  } catch (error) {
    console.log("Verify Error:", error);
    alert("❌ TRANSACTION FAILED. Please try again.");
  }
}

document.getElementById('leaderboardBtn').addEventListener('click', () => {
  window.location.href = 'leaderboard.html';
});

// for ai category suggestion
let aiTimer;

document.getElementById("description").addEventListener("input", function () {

    clearTimeout(aiTimer);

    const description = this.value.trim();

    if (!description) return;

    aiTimer = setTimeout(async () => {

        try {

            const response = await axios.post(
                "http://localhost:4000/ai/category",
                {
                    description
                }
            );

            document.getElementById("category").value =
                response.data.category.toLowerCase();

        } catch (err) {
            console.log(err);
        }

    }, 1000); // Wait 1 second after the user stops typing

});

// for download expenses

document.getElementById("downloadBtn").addEventListener("click", downloadExpense);
async function downloadExpense(){
  try{
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:4000/user/downloadExpense",
      {
        headers:{
          Authorization:token
        },
        responseType:"blob"
      }

    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download ="expenses.csv";
    a.click();
    window.URL.revokeObjectURL(url);

  }catch(err){
    console.log(err);
    alert("download failed");
  }
}

function showPagination(data){

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    if(data.hasPreviousPage){

        const prev = document.createElement("button");

        prev.innerText = "Previous";

        prev.onclick = ()=>getExpenses(data.currentPage-1);

        pagination.appendChild(prev);
    }

    for(let i=1;i<=data.lastPage;i++){

        const btn=document.createElement("button");

        btn.innerText=i;

        btn.onclick=()=>getExpenses(i);

        pagination.appendChild(btn);
    }

    if(data.hasNextPage){

        const next=document.createElement("button");

        next.innerText="Next";

        next.onclick=()=>getExpenses(data.currentPage+1);

        pagination.appendChild(next);
    }

}