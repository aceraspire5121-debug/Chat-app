if(!localStorage.getItem("chatToken"))
{
    window.location.href="/login.html"
}
let isMobile = window.innerWidth <= 820;
let socket;
let onlineUsers=[];
let allusers=[]
let selectedUser = null;
const user = JSON.parse(localStorage.getItem("user"));
const users = async () => {
    const data = await fetch("/api/users/all")
    const newdata = await data.json()
    allusers=newdata;
    render(allusers)
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).toLowerCase();
};


function initSocket(){
 socket = io("/", { //everyuser is sending request to the server io.on("connection") to make socket connection and that server is accepting the user request and establish socket connection along with this,server also generates socket object for each user having unique ids. 
// "/" means:
// Connect to the SAME origin (same protocol + domain + port) from which the webpage was loaded.
// io("/")
// Becomes internally:
// io("http://localhost:5000") if webiste load from 3000 port then it becomes io("http://localhost:3000")
  auth: {
    token: localStorage.getItem("chatToken")
  }
});

socket.on("connect", () => {
  console.log("socket connected:", socket.id);
  socket.emit("login", user._id);
});

socket.on("connect_error", (err) => {
  console.log("socket error:", err.message);
});

socket.on("online_users", (users) => { //socket.on mtlb user sun raha hai
  onlineUsers=users;
  render(allusers);
    console.log("Online users:", users);
});

socket.on("receive_message", (message) => {
  // Only show message if the current selected user is either sender or receiver
  if (!selectedUser) return; // No user selected yet

  // message = { senderId, receiverId, message, ... }
  if (message.senderId === selectedUser._id || message.receiverId === selectedUser._id) {
    // Determine if sent or received
    const type = message.senderId === user._id ? "sent" : "received";
    const time = formatTime(message.createdAt);

    // Append to .message container
    document.querySelector(".message").innerHTML += createMessageBubble(message.message, type,time);

    // Optional: scroll to bottom
    const messageDiv = document.querySelector(".message");
    messageDiv.scrollTop = messageDiv.scrollHeight;
  }
});


}

(async function init() {
  await users();        // FIRST load all users,users() async function hai to await laga skte hai aur ham chahte hai jab ye poora chal jaye tabhi aage bado
  initSocket();         // THEN connect socket
  messagebox()
})();


const render = (newdata = []) => { //if newdata defined hi na ho tab newdata ko empty array banado, ye assignment tabhi hoga jab newdata define nhi hoga barna bahi array rahega newdata me jo bheja gaya hoga
    if (!Array.isArray(newdata)) return; // js me function hi yahi hota hai Array.isArray() aur array empty hone par isliye jane de rahe hai taki empty list dikhe means no user available right now
    const container = document.querySelector(".userbox")
    container.innerHTML = ""
    newdata.forEach((u) => {
         if (u._id === user._id) return; // apna khud ka card mat dikha

      const isOnline = onlineUsers.includes(u._id.toString());


        container.innerHTML += ` <div
                        class="user-item flex items-center justify-between w-[80%] h-16 px-3 py-2 bg-[#1F2937] border-2 border-[#1E293B] rounded-xl hover:bg-gray-800 transition cursor-pointer" data-id="${u._id}">

                        <!-- Left part: Avatar + info -->
                        <div class="flex items-center gap-3">
                            <!-- Avatar -->
                            <div class="relative w-12 h-12">
                                <img class="w-full h-full rounded-full object-cover" src="svg/profile.svg"
                                    alt="User Avatar">
                                <!-- Online/Offline dot -->
                                <span
                                    class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1F2937] ${isOnline ? "bg-green-500" : "bg-gray-500"}"></span>
                                <!-- For offline, use bg-gray-400 -->
                            </div>

                            <!-- Info: Name + status -->
                            <div class="info flex flex-col justify-center">
                                <p class="text-white font-medium truncate">${u.name}</p>
                                <p class="text-gray-400 text-sm">${isOnline ? "Online" : "Offline"}</p>
                            </div>
                        </div>

                        <!-- Right part: Optional icon or status -->
                        <div class="secondpart hidden lg:block flex justify-center items-center">
                            <!-- Could be online.svg or leave empty if using dot -->
                            <img src="svg/${isOnline?'online.svg':'offline.svg'}" alt="status icon" class="w-5 h-5">
                        </div>

                    </div>`

    })
}


function createMessageBubble(text, type = "received",time,type2="nothistory") {
  const isOnline = onlineUsers.includes(selectedUser._id.toString());
  if(type2==="history" && type==="sent")
  {
return `<div class="flex justify-end mb-2">
                        <div class="relative max-w-[60%] min-w-[90px]
           bg-[#005C4B] text-white
           px-4 pt-2 pb-5 pr-14
           rounded-2xl rounded-br-md break-all">

                            ${text}

                            <div class="absolute bottom-1 right-2 flex items-center gap-1
             text-[10px] text-[#34B7F1] leading-none">
                                <span class="text-[#AEBAC1]">${time}</span>

                                <svg width="18" height="13" viewBox="0 0 20 14">
                                    <path d="M1.5 7.5L5 11L11.5 3" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7.5 7.5L11 11L17.5 3" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>

                        </div>
                    </div>`
  }
  else{
    if (type === "sent") {
        return `
        <div class="flex justify-end mb-2">
                        <div class="relative max-w-[60%] min-w-[90px]
           bg-[#005C4B] text-white
           px-4 pt-2 pb-5 pr-14
           rounded-2xl rounded-br-md break-all">

                            ${text}

                            <div class="absolute bottom-1 right-2 flex items-center gap-1
             text-[10px] ${isOnline?"text-[#34B7F1]":"text-[#8696A0]"} leading-none">
                                <span class="text-[#AEBAC1]">${time}</span>

                                <svg width="18" height="13" viewBox="0 0 20 14">
                                    <path d="M1.5 7.5L5 11L11.5 3" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7.5 7.5L11 11L17.5 3" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>

                        </div>
                    </div>
    `;
    } else {
        return `
      <div class="flex justify-start mb-2">
                        <div class="max-w-[60%] bg-[#273449] text-white px-4 py-2 rounded-2xl rounded-bl-md break-all">
                            ${text}
                        </div>
                    </div>
    `;
    }
  }
}

document.querySelector(".sendbtn").addEventListener("click", () => {
  const typebox = document.querySelector(".typebox").value.trim();
  if (!typebox || !selectedUser) return;

  // Send message via socket
  socket.emit("send_message", {
    senderId: user._id,
    receiverId: selectedUser._id,
    message: typebox
  });

  document.querySelector(".typebox").value = "";
});

document.querySelector(".typebox").addEventListener("keydown", (e) => {
  if(e.key==="Enter"){
  const typebox = document.querySelector(".typebox").value.trim();
  if (!typebox || !selectedUser) return;
  // Send message via socket
  socket.emit("send_message", {
    senderId: user._id,
    receiverId: selectedUser._id,
    message: typebox
  });
  document.querySelector(".typebox").value = "";
      }
});


async function loadChatHistory(receiverId) {
    // console.log("TOKEN:", localStorage.getItem("chatToken"));
    const res = await fetch(`/api/messages/${receiverId}`, {
         headers: { "Authorization": `Bearer ${localStorage.getItem("chatToken")}` }
    });
    const messages = await res.json();
    const messageDiv = document.querySelector(".message");
    messageDiv.innerHTML = ""; // clear old messages

    messages.forEach(msg => {
        const type = msg.senderId === user._id ? "sent" : "received";
        const time = formatTime(msg.createdAt);
        messageDiv.innerHTML += createMessageBubble(msg.message, type,time,"history");
    });

    // scroll to bottom
    messageDiv.scrollTop = messageDiv.scrollHeight;
}



function messagebox() {
  document.querySelector(".userbox").addEventListener("click", (e) => {
    const card = e.target.closest(".user-item");
    if (!card) return;

    const userId = card.dataset.id;
    const index = allusers.findIndex(u => u._id === userId);
    if (index === -1) return;

    const u = allusers[index];
    const isOnline = onlineUsers.includes(u._id.toString());


    // Save selected user
    selectedUser = u;

    // Update header
    const firstPart = document.querySelector(".firstpart");
    firstPart.innerHTML = `
      <div class="user-item flex items-center justify-between w-full h-full px-3 py-2 bg-[#1F2937] border-t-2 border-b-2 border-[#374151] hover:bg-gray-800 transition cursor-pointer">
        <div class="flex items-center gap-3">
         <button class="backbtn mr-2 hidden flex items-center justify-center">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-white" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
</button>

          <div class="relative w-12 h-12">
            <img class="w-full h-full rounded-full object-cover" src="svg/profile.svg" alt="User Avatar">
            <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1F2937] ${isOnline ? "bg-green-500" : "bg-gray-500"}"></span>
          </div>
          <div class="info flex flex-col justify-center">
            <p class="text-white font-medium truncate">${u.name}</p>
            <p class="text-gray-400 text-sm">${isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div class="secondpart flex justify-center items-center">
          <button class="logout px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition">
            Logout
          </button>
        </div>
      </div>
    `;

   if (window.innerWidth <= 820) {
  document.querySelector(".leftcont").classList.add("hidden");
  document.querySelector(".backbtn").classList.remove("hidden");
  document.querySelector(".rightcont").classList.remove("hidden");

//   document.querySelector(".backbtn").addEventListener("click",()=>{
//         document.querySelector(".rightcont").style.display = "none";  //here multiple listeners were applying like on each click one listener was added
//          document.querySelector(".leftcont").classList.remove("hidden");
//   document.querySelector(".backbtn").classList.add("hidden");
//     })
}


    loadChatHistory(selectedUser._id)

    // Clear previous messages
    document.querySelector(".message").innerHTML = "";
  });
}

document.addEventListener("click",(e)=>{
    if(e.target.closest(".backbtn"))
    {
        if(window.innerWidth<=820)
        {
            document.querySelector(".rightcont").classList.add("hidden")
         document.querySelector(".leftcont").classList.remove("hidden");
  document.querySelector(".backbtn").classList.add("hidden");
        }
    }
})

function handleResponsive()
{
    if(window.innerWidth>820)
    {
        if(document.querySelector(".leftcont").classList.contains("hidden"))
            document.querySelector(".leftcont").classList.remove("hidden");
        if(!document.querySelector(".rightcont").classList.contains("hidden"))
        {
            document.querySelector(".rightcont").classList.add("hidden")
        }
        // style.display se inline css lag jati hai jab size <820 hota hai aur inline css ki priority jyada hoti hai external css jo ki media query se lagi hai isliye 820px se kam hone ke baabjood bhi media query overwrite nhi kar pa rahi hai inline css ko isliye style.display mat use karo
    }
}

 // Attach logout listener
 document.addEventListener("click",(e)=>{
    if(e.target.closest(".logout"))
    {localStorage.removeItem("chatToken");
      localStorage.removeItem("user");
      window.location.href = "/login.html";
    }
 })

handleResponsive();
window.addEventListener("resize",handleResponsive) //eventlistener me function call nhi,function reference jata hai






