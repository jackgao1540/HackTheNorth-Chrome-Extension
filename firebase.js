// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCoV6cgS2E0Ypdvp-qsxS089TYWL0nOlJM",
  authDomain: "mindflow-1.firebaseapp.com",
  databaseURL: "https://mindflow-1-default-rtdb.firebaseio.com/",
  projectId: "mindflow-1",
  storageBucket: "mindflow-1.appspot.com",
  messagingSenderId: "791719676716",
  appId: "1:791719676716:web:5b6e270a603f865ad4ba89"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//debug
console.log(firebase);



chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if(msg.command === 'getData'){
    firebase.database().ref('/').once('value').then(function(snapshot){
      response({type: "result", status: "success", data: snapshot.val(), request: msg});
    });

  }


  if(msg.command == 'save'){

    //..
    var hist = msg.data.hist;
    var todo = msg.data.todo;
    var goals = msg.data.goals;

    var user = msg.data.user;
    console.log(user);
    if(user.length > 1 && user.length < 20 && !user.includes('\n'))firebase.database().ref('/userName/').set({user: user});
    else firebase.database().ref('/userName/').set({user: "Your Name Here"});
    for(elt of hist){
      //update later
    }

    if(todo.length >0 ){
        firebase.database().ref('/TaskLists/To-Do').set(null);
      for(var i = 0; i < todo.length; i++){
        firebase.database().ref('/TaskLists/To-Do/' + i).set(todo[i]);
      } 
    }
    if(goals.length > 0){
      firebase.database().ref('/TaskLists/Daily').set(null);
      for(var i = 0; i < goals.length; i++){
        firebase.database().ref('/TaskLists/Daily/' + i).set(goals[i]);
      } 
    }

  }




  return true;
});
