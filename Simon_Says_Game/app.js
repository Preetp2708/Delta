let gamesequence = [];
let usersequence = [];
let level = 0;
let started = false;
let btns = ["red", "blue", "orange", "green"];

let h3 = document.querySelector("h3");

document.addEventListener("mousedown", function() {
    if (started == false) {
        console.log("Game Started");
        started = true;

        levelUp();
    }
});
document.addEventListener("keypress", function(e) {
    if (started == false) {
        console.log("Game Started");
        started = true;
        levelUp();
        return;
    }
    // Keyboard color effect
    let key = e.key.toLowerCase();
    let colorMap = { r: "red", g: "green", b: "blue", o: "orange" };
    if (key in colorMap) {
        let btn = document.getElementById(colorMap[key]);
        if (btn) {
            btnpress.call(btn);
        }
    }
});
function btnFlash(btn) {

    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 300);

}
function userFlash(btn) {

    btn.classList.add("user-flash");
    setTimeout(function() {
        btn.classList.remove("user-flash");
    }, 300);

}

function levelUp() {
    usersequence = [];
    level++;

    h3.innerText = "Level " + level;

    let rand_idx = Math.floor(Math.random() * btns.length);
    let rand_color = btns[rand_idx];
    let rand_btn = document.querySelector(`#${rand_color}`);
    gamesequence.push(rand_color);
    btnFlash(rand_btn);


}

function checkAnswer(idx) {
    if (usersequence[idx] === gamesequence[idx]) {
        if (usersequence.length === gamesequence.length) {
            console.log("Success");
            setTimeout(levelUp, 1000);
        }
        return;

    }
    else {
        console.log("Wrong");
        h3.innerHTML = `Game Over,Your score is <b> ${level-1}</b> Press Any Key to Restart`;
        resetall();
    }
}

function btnpress(){
    let btn = this;
    userFlash(btn);
    let usercolor = btn.id;
    usersequence.push(usercolor);
    checkAnswer(usersequence.length - 1);
}

let allbtn = document.querySelectorAll(".box");

for(btn of allbtn){
    btn.addEventListener("click",btnpress);
}

function resetall(){
    started = false;
    gamesequence = [];
    usersequence = [];
    level = 0;

}