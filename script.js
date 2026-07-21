// Progress Animation

const progressBar = document.getElementById("progressBar");
const progressValue = document.getElementById("progressValue");

let progress = 0;

const target = 78;

const animation = setInterval(() => {

    if(progress >= target){

        clearInterval(animation);

    }else{

        progress++;

        progressBar.style.width = progress + "%";

        progressValue.innerHTML = progress + "%";

    }

},20);


// Weekly Stand-up Fake Data

const completed = [

    "Payment API completed",

    "Dashboard redesign finished",

    "Resolved login issue"

];

const inProgress = [

    "AI integration",

    "User acceptance testing",

    "Performance optimization"

];

const blockers = [

    "Waiting for client approval",

    "Missing production credentials"

];

const nextWeek = [

    "Deploy staging environment",

    "Complete documentation",

    "Sprint planning"

];



// Generate Button

document
.getElementById("generateBtn")
.addEventListener("click",generateReport);

function generateReport(){

    fillList("completed",completed);

    fillList("progressList",inProgress);

    fillList("blockers",blockers);

    fillList("nextWeek",nextWeek);

    randomProgress();

}



function fillList(id,data){

    const list=document.getElementById(id);

    list.innerHTML="";

    data.forEach(item=>{

        const li=document.createElement("li");

        li.innerHTML=item;

        list.appendChild(li);

    });

}



// Random Project Progress

function randomProgress(){

    const value=Math.floor(Math.random()*26)+70;

    progressBar.style.width=value+"%";

    progressValue.innerHTML=value+"%";

}



// Welcome Message

const hour=new Date().getHours();

if(hour<12){

    console.log("Good Morning");

}

else if(hour<18){

    console.log("Good Afternoon");

}

else{

    console.log("Good Evening");

}



// Small Button Animation

const button=document.getElementById("generateBtn");

button.addEventListener("mousedown",()=>{

    button.style.transform="scale(.97)";

});

button.addEventListener("mouseup",()=>{

    button.style.transform="scale(1)";

});

button.addEventListener("mouseleave",()=>{

    button.style.transform="scale(1)";

});
