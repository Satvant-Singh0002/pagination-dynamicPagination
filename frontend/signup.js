document.getElementById('signupForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userObj={
        name,
        email,
        password
    }

    try {
        const response=await axios.post('http://localhost:4000/expenseUser/addUser',
            userObj
        );
          window.location.href="login.html";
          console.log(response.data);
          document.getElementById('signupForm').reset();
    } catch (error) {
       
        if(error.response.status===409){
            alert("user already exist");
        }else{
            alert('something went wrong');
        }
         console.log("error while signup",error);
        
    }
});