document.getElementById('loginForm').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const loginObj={
        email,
        password
    }
    console.log('email',email);
    console.log('password',password);
    try {
        const response=await axios.post('http://localhost:4000/login/Userlogin',loginObj);
        alert('logged successfully');
        
    } catch (error) {
        if(error.response.status===404){
            alert('user not found');
        }else if(error.response.status===401){
            alert('password incorrect');
        }
        console.log(error);
        
    }
})