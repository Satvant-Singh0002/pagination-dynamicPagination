document.getElementById("ExpenseForm").addEventListener("submit", addExpense);
async function addExpense(e) {
  e.preventDefault();
  const expenseData = {
    expenseAmount: document.getElementById("expense").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
  };

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:4000/expense/addExpense',
      expenseData,
      {
    headers: {
      Authorization: token
    }
  }
    );
    
    showOnScreen(response.data);
  } catch (error) {
    console.log(error);
  }
}
// page refres show all expense 
window.addEventListener('DOMContentLoaded',async()=>{
 
  try {

    
  
    const token = localStorage.getItem('token');

    const response = await axios.get(
      'http://localhost:4000/expense/getExpense',
      {
        headers: {
          Authorization: token
        }
      }
    );
    const expenses= response.data;

    expenses.forEach(element => {
      showOnScreen(element);
      
    });

    
  } catch (error) {
    console.log(error);
    
  }
})

// show expense on screen
function showOnScreen(expense){
  const parent=document.getElementById('expenseList');
  const card = document.createElement('div');
  card.className='expense-card';
  card.innerHTML=`
   <h3>₹${expense.expenseAmount}</h3>
        <p>${expense.description}</p>
        <span>${expense.category}</span>
  `;
   const deleteBtn=document.createElement('button');
   deleteBtn.textContent='Delete';
   deleteBtn.addEventListener('click', async () => {
    try {
      //const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:4000/expense/deleteExpense/${expense.id}`,
        {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }
      );
      // UI se remove
      parent.removeChild(card);

    } catch (error) {
      console.log(error);
    }
  });
  card.appendChild(deleteBtn);
  parent.appendChild(card);
}
