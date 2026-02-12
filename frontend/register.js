
if(localStorage.getItem("chatToken"))
    window.location.href="/index.html"

document.querySelector(".registerbtn").addEventListener("click",async ()=>{
const namee=document.querySelector(".Givename").value.trim()
const email=document.querySelector(".Giveemail").value.trim()
const password=document.querySelector(".Givepass").value.trim()
  if (!namee || !email || !password) { //if any one of the three is missing show alert 
    alert("All fields are required");
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
    const data=await fetch("/api/users/register",{
         method:"POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({name:namee,email,password})
    })
    const newdata=await data.json()
    if(newdata.success)
    {
        alert(newdata.message)
        window.location.href="/login.html"
    }
    else{
        alert(newdata.message)
    }
  }catch(err){
     console.log("Error is",err)
  }
})
