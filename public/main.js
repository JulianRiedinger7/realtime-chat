// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-analytics.js';
import {
	getDatabase,
	onChildAdded,
	ref,
	query,
	push,
	orderByChild,
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js';

import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDld7zxFOEC7VuPiCFtKEbSvuOcpt0QWa8',
	authDomain: 'choriweb-9f1cc.firebaseapp.com',
	databaseURL: 'https://choriweb-9f1cc-default-rtdb.firebaseio.com',
	projectId: 'choriweb-9f1cc',
	storageBucket: 'choriweb-9f1cc.appspot.com',
	messagingSenderId: '429015558142',
	appId: '1:429015558142:web:4a95bb2bf2b406f2e582af',
	measurementId: 'G-6ZRJ9ESF33',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth();

const chatHolder = document.querySelector('#chat-holder');
const form = document.querySelector('form');
const btnGoogle = document.querySelector('.google-btn');
const textoLog = document.querySelector('.textoLog');
const desloguear = document.querySelector('.desloguear');
const listaMensajes = document.querySelector('.list-group');
const nombre = document.querySelector('#nombre');
const main = document.querySelector('main');
const loading = document.querySelector('.loading');

const msgRef = query(ref(db, 'mensajes/'), orderByChild('fecha'));

const agregarAlChat = (data) => {
	/* const fechaLocal = data.fecha.toLocaleString(); */

	console.log(data.fecha);

	listaMensajes.innerHTML += `
    <li class="list-group-item d-flex gap-2 align-items-center" id='${data.fecha}'>
		<img src="${data.photo}" alt="${data.nombre}" />
		<span>${data.nombre}: ${data.mensaje}</span>
		<span class='ms-auto'>${data.fecha}</span>
		</li>
  `;

	document
		.getElementById(data.fecha)
		.scrollIntoView({ block: 'end', behavior: 'smooth' });
};

const agregarADatabase = (mensaje) => {
	const objMensaje = {
		nombre: auth.currentUser.displayName,
		photo: auth.currentUser.photoURL,
		email: auth.currentUser.email,
		mensaje: mensaje,
		fecha: new Date().toLocaleTimeString(),
	};
	push(msgRef, objMensaje);
};

const signIn = () => {
	const provider = new GoogleAuthProvider();
	auth.languageCode = 'es';
	signInWithPopup(auth, provider).then((result) => {
		nombre.value = result.user.displayName;
		form.classList.remove('d-none');
		btnGoogle.classList.add('d-none');
		textoLog.classList.add('d-none');
		chatHolder.classList.remove('d-none');
	});
};

const logout = () => {
	signOut(auth).then(() => {
		form.classList.add('d-none');
		btnGoogle.classList.remove('d-none');
		textoLog.classList.remove('d-none');
		chatHolder.classList.add('d-none');
	});
};

onChildAdded(msgRef, (snap) => {
	const data = snap.val();
	agregarAlChat(data);
});

form.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const mensaje = document.querySelector('#mensaje');
	if (mensaje.value !== '') {
		agregarADatabase(mensaje.value);
		mensaje.value = '';
	} else alert('Es necesario ingresar nombre y mensaje');
});

btnGoogle.addEventListener('click', signIn);

desloguear.addEventListener('click', logout);

onAuthStateChanged(auth, (userLog) => {
	if (userLog) {
		nombre.value = auth.currentUser.displayName;
		form.classList.remove('d-none');
		btnGoogle.classList.add('d-none');
		textoLog.classList.add('d-none');
		loading.classList.add('d-none');
		main.classList.remove('d-none');
		chatHolder.classList.remove('d-none');
	} else {
		loading.classList.add('d-none');
		main.classList.remove('d-none');
	}
});
