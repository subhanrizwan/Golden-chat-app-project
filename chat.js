import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc,collection, query, where,orderBy, getDocs,addDoc,onSnapshot ,serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0R3tq8lEWoXmbjJKUhqhA9HCCC2kpV3I",
  authDomain: "chat-app-intern-e4080.firebaseapp.com",
  projectId: "chat-app-intern-e4080",
  storageBucket: "chat-app-intern-e4080",
  messagingSenderId: "966268577891",
  appId: "1:966268577891:web:18c7ef638f99e62ae2f056",
  measurementId: "G-XK6VDM620T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);



onAuthStateChanged(auth, async (user) => {
  if (user) {
    localStorage.setItem('uid', user.uid);
    console.log(user.email);
    getAllUsers(user.email);

    const docRef = doc(db, "users", user.uid);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const userData = docSnap.data(); 
  let img = document.getElementById('profile')
  let name1 = document.getElementById('curUser_name')
  let email1 = document.getElementById('curUser_email')

  name1.innerHTML =userData.name
  email1.innerHTML = userData.email
  
  if(userData.image){
    img.src = userData.image
  }
} else {
  console.log("No such document!");
}
  } else {
    console.log('No user is signed in.');
  }
});




const getAllUsers =async (email)=>{
  const q = query(collection(db, "users"), where("email", "!=", email));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data().uid);
  const {name, email,image,uid} = doc.data();
  // console.log(doc.data().uid);
let listUsers = document.getElementById('userList')
listUsers.innerHTML += ` 
<a href="#" onclick="selectChat('${name}','${email}','${image}','${uid}')" class="list-group-item list-group-item-action"></div>${doc.data().name}</a> ` 
  });}



  let SelectUserID;
  const selectChat =(name,email,image,uid)=>{
    SelectUserID = uid;
    let curUseruid = localStorage.getItem("uid");
    let chatID ;
    if(curUseruid < SelectUserID){
      chatID = curUseruid + SelectUserID;
    }else{
      chatID =SelectUserID + curUseruid;
  
    }
    let frndImage = document.getElementById('frnd_image')
    let frndName = document.getElementById('frndUser_name')
    let frndEmail = document.getElementById('frndUser_email')
frndName.innerHTML = name
frndEmail.innerHTML = email
if(frndImage != 'undefined'){
  frndImage.src = image
}
getAllMessages(chatID);
}
  window.selectChat = selectChat;


  const sendMessage = async () => {
    let sentMsg = document.getElementById('sent-msg');
    let curUseruid = localStorage.getItem('uid');
    let chatID;
    if (curUseruid < SelectUserID) {
      chatID = curUseruid + SelectUserID;
    } else {
      chatID = SelectUserID + curUseruid;
    }
    if (sentMsg.value.trim() !== "") {
        const docRef = await addDoc(collection(db, "messages"), {
            chatID: chatID,
            message: sentMsg.value,
            timestamp: serverTimestamp(),
            sender: curUseruid,
            reciever: SelectUserID
        });
        sentMsg.value = "";
    }
  }
  
  document.getElementById('sent-msg').addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      sendMessage();
    }
  });
  
  document.getElementById('sent-icon').addEventListener("click", sendMessage);

//   let sentMsg = document.getElementById('sent-msg')
//   sentMsg.addEventListener("keydown",async(e)=>{
//     if(e.keyCode == 13){
//       let curUseruid = localStorage.getItem('uid');
//       // console.log("curUser",curUseruid);
//   // console.log("SelectUserID",SelectUserID);

//   let chatID ;
//   if(curUseruid < SelectUserID){
//     chatID = curUseruid + SelectUserID;
//   }else{
//     chatID =SelectUserID + curUseruid;

//   }
//   console.log("chatID",chatID);
//   const docRef = await addDoc(collection(db, "messages"), {
//     chatID: chatID,
//     message: sentMsg.value,
//     timestamp : serverTimestamp() ,
//     sender : curUseruid,
//     reciever : SelectUserID
//   });
//   sentMsg.value = ""
//     }
//   })


  const getAllMessages = (chatID)=>{
const q = query(collection(db, "messages"),orderBy("timestamp"), where("chatID", "==", chatID));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let curUserid = localStorage.getItem("uid");
  let chatBox = document.getElementById('chat-box')
    const messages = [];
  querySnapshot.forEach((doc) => {
    messages.push(doc.data());

  });
  chatBox.innerHTML = ""
  for(var i=0; i<messages.length; i++){
    if(curUserid === messages[i].sender){
    
    chatBox.innerHTML += `
    <div class="msg-row msg-row2 right-message">
                        <div class="msg-text">
                                <p>${messages[i].message}</p>                        
                        </div>
                    </div>
    `
    }else{
        chatBox.innerHTML += `
    
        <div class="msg-row left-message">
        <div class="msg-text">
                <p>${messages[i].message}</p>                        
        </div>
    </div>
    
    `
    }
    }
    
  console.log("messges",messages);
});
  }