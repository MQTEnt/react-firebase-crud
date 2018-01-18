import firebase from 'firebase';
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
	apiKey: "secret-key",
	authDomain: "secret-key",
	databaseURL: "secret-key"
};
var fire = firebase.initializeApp(config);
export default fire;