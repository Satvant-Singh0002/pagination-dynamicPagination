document.getElementById("ExpenseForm").addEventListener("submit", addExpense);
async function addExpense(e) {
  e.preventDefault();
  const expenseData = {
    expenseAmount: document.getElementById("expense").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
  };

  try {
    const response = await axios.post(
      'http://localhost:4000/expense/addExpense',
      expenseData,
    );
    
    showOnScreen(response.data);
  } catch (error) {
    console.log(error);
  }
}
// page refres show all expense 
window.addEventListener('DOMContentLoaded',async()=>{
 
  try {
    const response = await axios.get('http://localhost:4000/expense/getExpense');
  
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
  `
 
  parent.appendChild(card);
}
