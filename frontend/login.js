
if(localStorage.getItem("chatToken"))
    window.location.href="/index.html"

document.querySelector(".loginbtn").addEventListener("click",async ()=>{
    const email=document.querySelector(".email").value.trim()
    const password=document.querySelector(".pass").value.trim()
    if(!email || !password)
    {
        alert("All fields are required")
        return;
    }
     const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
if(!isValidEmail(email))
{
      alert("Enter a valid email address");
  return;
}
    if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }
  try{
    const data=await fetch("/api/users/login",{
        method:"POST",
        headers: {"Content-Type": "application/json"},
            body:JSON.stringify({email,password})
    })
    const newdata=await data.json()
    if(newdata.success)
    {
        localStorage.setItem("chatToken",newdata.token)
         localStorage.setItem("user", JSON.stringify(newdata.UserExist))
        window.location.href="/index.html"
    }
    else{
        alert(newdata.message)
    }
  }catch(err)
  {
    console.log('eroor is',err);
  }
})