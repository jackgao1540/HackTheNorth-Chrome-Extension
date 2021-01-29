///App.js

function getData(){
  //Fetch data from database
  //first clear existing data
  document.querySelector('#tasks').innerText='';
  document.querySelector('#username').innerText='';
  chrome.runtime.sendMessage({command: "getData", data: {notes: ''}}, (response) => {
    //listen for a response...
    var db = response.data;
    console.log(db);
    var username = db['userName'].user;
    var todo = db['TaskLists']['To-Do'];
    var goals = db['TaskLists']['Daily'];
    var hist = db['History'];
    window.username = username;
    window.todo = todo;
    window.goals = goals;
    window.hist = hist;

    // console.log(username);
    // console.log(todo);
    // console.log(goals);
    // console.log(hist);
    document.querySelector('#username').innerText=username;
    document.querySelector('#tasks').innerHTML += "<u class = 'taskTitle'>Daily Goals</u>";
    var nav = '<ul id = "gList" contenteditable="true" class = "editor">';
    var size = 0;
    console.log(goals);
    for(const id in goals){
      if(goals[id]){nav += '<li placeholder = "type goal here..."  goalID="'+id+'">'+goals[id]+'</li>';size++;}
    }
    //add size to HTML
    document.querySelector('#tasks').innerHTML += "<p class = 'size'>"+size + "</u>";
    nav += '</ul>';
    document.querySelector('#tasks').innerHTML += nav;
    document.querySelector('#tasks').innerHTML += "<u class = 'taskTitle'>To-Do's</u>";
    nav = '<ul id = "tList" contenteditable="true" class = "editor">';
    size = 0;
    console.log(todo);
    for(const id in todo){
      if(todo[id]){size++;nav += '<li placeholder = "type task here..." todoID="'+id+'">'+todo[id]+'</li>';}
    }
    //add size HTML
    document.querySelector('#tasks').innerHTML += "<p class = 'size'>"+size + "</u>";
    nav += '</ul>';
    document.querySelector('#tasks').innerHTML += nav;
    eventListeners();
  });
  
}

getData();

function update(){
  console.log("something changed!");
  goalListElements = document.querySelectorAll("#gList li");
  todoListElements = document.querySelectorAll("#tList li");
  user = document.getElementById("username").innerText;
  var glist = [], tlist = [];
  for(elt of goalListElements)if(elt.innerText && elt.innerText.length > 1)glist.push(elt.innerText);
  for(elt of todoListElements)if(elt.innerText && elt.innerText.length > 1)tlist.push(elt.innerText)
  console.log(glist);
  console.log(tlist);
  console.log(user);
  //remember to update hist
  //save the data
  chrome.runtime.sendMessage({command:"save", data: {user: user, hist: window.hist, todo: tlist, goals: glist}}, (response) => {});
  getData();
}

function subscriber(mutations) {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      const prev = node.previousSibling;
      if (prev) {
        prev.innerHTML = `<span>${prev.innerHTML.replace(/<br>$/, '')}</span>`;
      }
    });
  });
}


function eventListeners(){
  var lis = document.querySelectorAll('#tasks ul');
  console.log(lis);
  for(var i = 0; i < lis.length; i++){
    lis[i].addEventListener("blur", function(){
      update();
    });
  }
  document.getElementById('username').addEventListener("blur", function(){
    update();
  });
  //for lists
  
  const observer = new MutationObserver(subscriber);
  observer.observe(document.querySelector('ul[contenteditable]'), { childList: true });
}





