var config = {
	apiKey: "AIzaSyDI3iY0pqME0WKatwGYdSINUWejRu1YSjM",
	authDomain: "project-8743018060077641250.firebaseapp.com",
	databaseURL: "https://project-8743018060077641250.firebaseio.com",
	storageBucket: "project-8743018060077641250.appspot.com",
	};
firebase.initializeApp(config);

//create an instance of Google provider object
var provider = new firebase.auth.GoogleAuthProvider();

fillInButtonOnRefresh();

$('.loginButton').on('click', function () {
	var user = firebase.auth().currentUser;
	if (!user) {
		login();
	} else {
		logout();
	}
});


function login() {
	//sign in with popup
	firebase.auth().signInWithPopup(provider).then(function (result) {
		//This gives you a Google Access Token.
		var token = result.credential.accessToken;
		//The signed-in user info
		var user = result.user;
		var username = user.displayName;
		$('#userMessage').text("Welcome "+username+"!");

		// appendPhoto(user);

		// $('.loginButton').text('Logout');
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

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		//User is signed in
		$('.loginButton').text('Logout');
		appendPhoto(user);
		$('#userMessage').text("Welcome "+user.displayName+"!");
	} else {
		//No user is signed in
		$('.loginButton').text('Login With Google');
	}
});

function fillInButtonOnRefresh () {
	var user = firebase.auth().currentUser;
	if (!user) {
		$('.loginButton').text('Login With Google');
	} else {
		$('.loginButton').text('Logout');
		appendPhoto(user);
		$('#userMessage').text("Welcome "+user.displayName+"!");
	}
};

function appendPhoto(userData) {
	var userImgURL = userData.photoURL;
	$('<img>', {
		src: userImgURL
	}).appendTo($('#userImgDiv'));
};