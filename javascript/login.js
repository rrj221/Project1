var userIsLoggedIn = false;

var config = {
	apiKey: "AIzaSyDI3iY0pqME0WKatwGYdSINUWejRu1YSjM",
	authDomain: "project-8743018060077641250.firebaseapp.com",
	databaseURL: "https://project-8743018060077641250.firebaseio.com",
	storageBucket: "project-8743018060077641250.appspot.com",
	};
firebase.initializeApp(config);

//create an instance of Google provider object
var provider = new firebase.auth.GoogleAuthProvider();

console.log(provider);

$('.loginButton').on('click', function () {
	if (!userIsLoggedIn) {
		login();
	} else {
		logout();
	}
});


function login() {
	//sign in with popup
	firebase.auth().signInWithPopup(provider).then(function (result) {
		//This gives you a Google Access Token.
		console.log(result);
		var token = result.credential.accessToken;
		//The signed-in user info
		var user = result.user;
		var username = user.displayName;
		console.log(username);
		$('#userMessage').text("Welcome "+username+"!");

		var userImgURL = user.photoURL;
		$('<img>', {
			src: userImgURL
		}).appendTo($('#userImgDiv'));

		$('.loginButton').text('Logout');
		userIsLoggedIn = true;
	}).catch(function (error) {
		//Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		//The email of the user's account used.
		var email = error.email
		//The firebase.auth.Auth.AuthCredential type that was used.
		var credential = error.credential;
		console.log(errorMessage);
	});
};

function logout() {
	firebase.auth().signOut().then(function() {
		$('#userMessage').text('');
		$('#userImgDiv').empty();
		$('.loginButton').text('Login With Google');
		userIsLoggedIn = false;
	}, function(error) {
		console.log(error);
	});
};