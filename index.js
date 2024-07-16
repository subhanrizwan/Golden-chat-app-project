import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getFirestore,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB0R3tq8lEWoXmbjJKUhqhA9HCCC2kpV3I",
  authDomain: "chat-app-intern-e4080.firebaseapp.com",
  projectId: "chat-app-intern-e4080",
  storageBucket: "chat-app-intern-e4080.appspot.com",
  messagingSenderId: "966268577891",
  appId: "1:966268577891:web:18c7ef638f99e62ae2f056",
  measurementId: "G-XK6VDM620T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore(app);

let reg = document.getElementById('reg_btn')
reg.addEventListener('click', () => {

  let name = document.getElementById('name')
  let email = document.getElementById('email-reg')
  let pass = document.getElementById('pass-reg')
  let img = document.getElementById('file')
  let spinner = document.getElementById('spin')

 if (name.value) {
    if (email.value) {
      if (pass.value) {
      } else { swal("please enter passwprd") }
    } else { swal("please enter your email") }
  } else { swal("please enter your name") }
  


  spinner.style.display = "block"
  reg.disabled = true
  createUserWithEmailAndPassword(auth, email.value, pass.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log("User registered --->", user.email);
      spinner.style.display = "none"
       reg.disabled = false 

      swal("You have Registered", "congrats!", "success");

      try {
        await setDoc(doc(db, "users", user.uid), {
          name: name.value,
          email: email.value,
          pass: pass.value,
          uid: user.uid
        });
        console.log("Document written with ID: ", user.uid);
      } catch (e) {
        spinner.style.display = "none"
       reg.disabled = false
       swal("you can't Register for same errors", "try again!", "error");
        console.error("Error adding document: ", e);
      }

      const storageRef = ref(storage, `images/${img.files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, img.files[0]);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          name.value = ""
          email.value = ""
          pass.value = ""
          img.value = ""
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);

            let url = downloadURL
            console.log(url);

            const washingtonRef = doc(db, "users", user.uid);
            await updateDoc(washingtonRef, {
              image: url,
              timestamp: serverTimestamp(),
            });


          });
        }
      );
      setTimeout(()=>{
        formreg.style.display = 'none';
        formlog.style.display = 'block';
        formlog.style.display = 'flex';
      },2000)

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
})





// Login-start
let formreg = document.getElementById('form-reg');
let formlog = document.getElementById('form-login');
var log = document.getElementById('log_btn');

log.addEventListener('click', () => {

  formreg.style.display = 'none'
  formlog.style.display = 'block'
  formlog.style.display = 'flex'

  
});

var log1 = document.getElementById('log_btn1');

log1.addEventListener('click', () => {
  let email_log = document.getElementById('email-log');
  let pass_log = document.getElementById('pass-log');
  let spin2 = document.getElementById('spin2')

    if (email_log.value) {
      if (pass_log.value) {
    } else { swal("please enter your password") }
  } else { swal("please enter your email") }

  spin2.style.display = "block"
  reg.disabled = true

  signInWithEmailAndPassword(auth, email_log.value, pass_log.value)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);

    email_log.value =""
    pass_log.value =""

    setTimeout(()=>{
      spin2.style.display = "none"
      reg.disabled = false
     
    },2000)


    window.location = 'chat.html'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    swal("you can't login for same errors", "try again!", "error");
    spin2.style.display = "none"
    reg.disabled = false
  });
})

