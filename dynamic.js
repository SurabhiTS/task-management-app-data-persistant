
const allTasks = document.getElementById("tasks-container");
let todaysHeading = document.createElement("h2");
todaysHeading.innerText = "Today";

let id = localStorage.getItem("latestId") == null ? 0: Number(localStorage.getItem("latestId"));
let allDates = [];
let dates =[];
let localStoredDates = [];
let localStoredItems;
let oldItems;
for(let i=0;i< localStorage.length ; i++){
    
    if(localStorage.key(i) != "latestId" && localStorage.key(i) != "loglevel" && localStorage.key(i) != "debug"){
        localStoredDates.push(localStorage.key(i)); // only keys which are dates are stored in localStoredDates
    }
   
}

sortLocalStoredDates();

loadOldTasks();

function loadOldTasks(){
    for(let i = 0 ; i < localStoredDates.length ; i++){
        let taskObj;
        oldItems = JSON.parse(localStorage.getItem(localStoredDates[i]));
        for(let x of oldItems){
            taskObj = JSON.parse(x);
            
            addTask(taskObj["date"], new Date(taskObj["date"]+" "+ taskObj["time"]), taskObj["task"], taskObj["taskId"],taskObj["done"]);
        }
     
    }

}




   

document.getElementById("btn").addEventListener("click",function(){
    const errorMessage = document.getElementById("errorMessage");
    const inputs = document.getElementsByTagName("input");
    
    
    let dateTime = new Date(inputs[1].value);
    //input validation 
    
    let invalidInputs = (inputs[0].value == "") || (inputs[1].value == "") || (dateTime.getTime() < new Date().getTime());

    if(!invalidInputs){
        let fullDate = dateTime.toDateString();     
        errorMessage.innerText  = "";
        addToLocalStorage(fullDate,dateTime,inputs,++id);
        addTask(fullDate,dateTime,inputs[0].value, id);       
      }
    else{
        errorMessage.innerText = "Please fill task and date";
    }

    }
  );




document.getElementById("tasks-container").addEventListener("click",function(event){
    const target = event.target;
    let taskName = target.parentElement.firstElementChild;
    let cardDate = target.parentElement.parentElement.firstElementChild;
    let oneDayCard,date,taskId;
    
    if(target.className == "bi bi-check-lg"){
        taskName.style.textDecoration = "line-through";
        target.style.display = "none";
        date = cardDate.innerText;
        updateLocalStorage(date,target);
    }

    if(target.className == "bi bi-trash"){
        oneDayCard = target.parentElement.parentElement;
        taskId = target.parentElement.id;
        target.parentElement.remove();
       
        removeLocalStrorageCopy(cardDate.innerText,taskId );
        // if the card has only one child which is heading , then the card is deleted
        if(oneDayCard.children.length == 1){
            for(let i in localStoredDates){
                if(oneDayCard.firstElementChild.innerText == localStoredDates[i]){
                    localStoredDates.splice(i,1);
                }
            }
                
            oneDayCard.remove(); // card is deleted if all the tasks for the date are done
        }
        
    }
    
}); 


function addToLocalStorage(fullDate,dateTime, inputs){
    let taskToBeAdded, localStoredItems;
    
    localStoredItems = JSON.parse(localStorage.getItem(fullDate));
   
    if(localStoredItems == null){
        localStorage.setItem(fullDate,'[]');
        localStoredItems = [];
    }
    taskToBeAdded = JSON.stringify({
        taskId : id,
        task : inputs[0].value,
        date : dateTime.toDateString(),
        time : dateTime.toTimeString(),
        done : false
    });
    
    localStoredItems.push(taskToBeAdded);
    
    localStorage.setItem(fullDate,JSON.stringify(localStoredItems));
    localStorage.setItem("latestId",id);
    
    if( !localStoredDates.includes(fullDate)){
        localStoredDates.push(fullDate);
    }
   
    sortLocalStoredDates();
    
}


function sortLocalStoredDates(){
    localStoredDates.sort((a,b) => {
        if(new Date(a).getTime() > new Date(b).getTime()){
            return 1;
        }
        else{
            return -1;
        }
    });

}


function addTask(fullDate,dateTime,input, id, done = false){
   
    let oneDayCard;
    let cardHeading,todayHeading;
    const text = document.createElement("div");
    const task = document.createElement("div");
    const time = document.createElement("div");
    const tick = document.createElement("i");
    const del = document.createElement("i");
  
    
    tick.className ="bi bi-check-lg";
    del.className = "bi bi-trash";
    task.classList.add("task");
    time.classList.add("timeBox");
    text.classList.add("textStyle");
    task.id = id;
   
    text.innerText = input;
    if(done == true){
        text.style.textDecoration = 'line-through';
        tick.style.display = "none";
    }
    time.innerText = dateTime.toLocaleTimeString();
    task.append(text,time,tick,del);
    
   
   if(document.getElementsByTagName("h3").length > 0){
        for(let i=0;i< document.getElementsByTagName("h3").length ; i++){
           
            if(document.getElementsByTagName("h3")[i].innerText == fullDate){
                oneDayCard = document.getElementsByTagName("h3")[i].parentElement;
                break;
            }
        }
   }
   if(oneDayCard == undefined){
        oneDayCard = document.createElement("div");
        oneDayCard.classList.add("oneDayPlan");
        cardHeading = document.createElement("h3");
        cardHeading.innerText = fullDate;
        if(fullDate == new Date().toDateString()){
            todayHeading = document.createElement("h2");
            todayHeading.innerText = "Today";
            cardHeading.style.display = "none";
            oneDayCard.append(cardHeading,todayHeading);
        }
        else{
            oneDayCard.append(cardHeading);
        }
        
       
        allTasks.insertBefore(oneDayCard,allTasks.children[localStoredDates.indexOf(fullDate)]);
        
   }
   
    oneDayCard.append(task);
}



function updateLocalStorage(date,target){
    let searchThisObj,updatedTask;
    searchThisObj = JSON.parse(localStorage.getItem(date)); // localStorage -> Wed Jan 5 2024 : [{task1 obj},{task2 obj}..]
        for(let i = 0 ; i < searchThisObj.length ;i++){
          
            if(JSON.parse(searchThisObj[i]).taskId == target.parentElement.id){
                updatedTask = JSON.parse(searchThisObj[i]);
                updatedTask["done"] = true;
                searchThisObj[i] = JSON.stringify(updatedTask);
                break;
            }
            
        }
        localStorage.setItem(date, JSON.stringify(searchThisObj));
}


function removeLocalStrorageCopy(date, taskId ){
    let  arrOfTasks;
    arrOfTasks = JSON.parse(localStorage.getItem(date));// get parsed array of tasks for the date into arrOfTasks
    for(let i=0; i < arrOfTasks.length;i++){
        if(JSON.parse(arrOfTasks[i])["taskId"] == taskId){
            arrOfTasks.splice(i,1); // remove the item with taskId
            break;
        }
    }
   
    localStorage.setItem(date, JSON.stringify(arrOfTasks)); // leads to deletion of the task in local storage
    if(JSON.parse(localStorage.getItem(date)).length == 0){ // if all the tasks for particular day are done, clear the storage for that date
        localStorage.removeItem(date);  
    }

    
}