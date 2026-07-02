const form = document.getElementById('forgotPasswordForm');
form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    try{
        const response = await axios.post("http://localhost:4000/forgot/forgotPassword",
            {
            email
        }
    );
  form.reset();
    }catch(err){

        console.error(err);
        alert('Failed to send password reset email');
    }
});