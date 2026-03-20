// DOM Element                            
const wordElement=document.querySelector('.heading');
const InputWordElement=document.querySelector('.inputWord');
const ScoreElement=document.querySelector('.score');
const streakElement=document.querySelector('.streak');
const timerElement=document.querySelector('.timer');
const feedbackElement=document.querySelector('.feedback');
const highScoreElement=document.querySelector('.highScore');
const highStreakElement=document.querySelector('.highStreak');
const restartElement=document.querySelector('.Restart');
const pauseElement=document.querySelector('.Pause');
const resumeElement=document.querySelector('.Resume');
const timeBarElement=document.querySelector('.timeBar');
const comboElement=document.querySelector('.comboContainer');
const overlayElement=document.querySelector('.gameOverlay');
const overlayTextElement=document.querySelector('.overlayText');
const startScreenElement=document.querySelector('.startscreen');
const startButtonElement=document.querySelector('.startbutton');

const easyword=words.filter(w => w.length <= 5);
const mediumword=words.filter(w => w.length >=6 && w.length <=9);
const hardword=words.filter(w => w.length >= 10);

//game variable
let Score =0;
let streak =0;
let lostCount = 0;
let currentWord = "";
let inputWord;
let lastword=null;

let timer = 5;
let maxtime;
let percentage;
let timerId=null;
let gameActive=true;
let isPaused=false;

Onload();

startButtonElement.addEventListener("click", startGame);

//initialization
function startGame(){
  gameActive = true;
  startScreenElement.style.display="none";
  InputWordElement.disabled=false;
  pauseElement.disabled = false;
  pauseElement.style.display = "block";
  startRound();
}
function Onload(){
 eventlistner();
 updateHighScoreUi();
 updateHighStreakUi();
}

//event listner
function eventlistner(){
  
 InputWordElement.addEventListener("keydown", (e) => {
    if(e.key === 'Enter' && gameActive)
    {
      score();
    }
  });
  restartElement.addEventListener("click", () =>{
    restart();
  });
   pauseElement.addEventListener("click", () =>{
    paused();
  });
   resumeElement.addEventListener("click", () =>{
    resumed();
  });
  document.addEventListener("keydown",(e) => {
    if(e.key==='Escape'){
      togglePause();
    }
  })
}

function startRound(){
  if(!gameActive || isPaused) return;

  InputWordElement.focus();

  const filteredWord = wordfilter(Score);
  currentWord = wordGenerator(filteredWord);

  displayWord(currentWord);
  updateUi();
  Hiderestart();
  hideResumeUI();
  
  const time = getTimeByScore(Score);
  StartTimer(time);
}

function wordfilter(point){
  if (point < 5) return easyword;
  else if(point <10) return mediumword;
  return hardword;
}

function wordGenerator(words){
  let index;
  let word;
  do {
     index = Math.floor(Math.random() * words.length);
      word = words[index];
  } while (word === lastword);
  lastword = word;
  return word;
}

function displayWord(arr){
 wordElement.textContent = arr;
}

function StartTimer(seconds){
  clearInterval(timerId);

  timer = seconds;
  maxtime = seconds;
  UpdateBar();
  timeBarElement.style.width = "100%";
  timerElement.textContent = timer;

  timerId=setInterval(()=>{
  if(!gameActive || isPaused) return;
  UpdateBar();
  timer--;
  timerElement.textContent = timer;

  if(timer <= 0)
  {
    GameOver();
  }
  }, 1000); 
}

function getTimeByScore(point){
    if(point < 5) return 5;
    else if(point <10) return 7;
    return 8;
}

function UpdateBar(){
  percentage = (timer/maxtime) * 100;
  timeBarElement.style.width = percentage + "%";
}

function score(){
  inputWord=InputWordElement.value.trim().toLowerCase();
  InputWordElement.value = '';
  
  if(inputWord ==="") return;
  if (inputWord === currentWord.toLowerCase())
  {
    showfeedback("correct!","green");
    Score++;
    streak++;
    showComboPopUp(streak);
  }
  else
  {
    showfeedback("wrong!","#e63946");
    lostCount++;
    streak = 0;
  }

  updateUi();

  if(lostCount >= 3) {
  GameOver(); 
  return;
  }  
  startRound();
}

function updateUi(){
  ScoreElement.textContent = Score;
  streakElement.textContent = streak;
}

function showfeedback(message, color ='red')
{
  feedbackElement.textContent = message;
  feedbackElement.style.color = color;

  setTimeout(()=>{
    feedbackElement.textContent = "";
  }, 800);
}

function showComboPopUp(combo){
  const popup = document.createElement("div");
  popup.classList.add("comboPopUp");
  popup.textContent = "x"+combo+"🔥";
  popup.style.left=(Math.random()*40-20)+"px";
  comboElement.appendChild(popup);

  setTimeout(()=>{
    popup.remove();
  },800);
}

function showOverlay(text){
  overlayTextElement.textContent = text;
  overlayElement.classList.add("active");
}

function hideOverlay(){
  overlayElement.classList.remove("active");
}

function SetHighScore(){
  const saved=Number(localStorage.getItem('HighScore')) || 0;
  if( Score > saved){
    localStorage.setItem('HighScore', Score);
  }
  updateHighScoreUi();
}

function updateHighScoreUi(){
  highScoreElement.textContent = localStorage.getItem('HighScore') || 0;
}

function SetHighStreak(){
   const saved=Number(localStorage.getItem('HighStreak')) || 0;
  if( streak > saved){
    localStorage.setItem('HighStreak', streak);
  }
  updateHighStreakUi();
}

function updateHighStreakUi(){
  highStreakElement.textContent = localStorage.getItem('HighStreak') || 0;
}

function Showrestart(){
  restartElement.style.display='block';
  restartElement.disabled=false;
}

function Hiderestart(){
  restartElement.style.display='none';
  restartElement.disabled=true;
}

function restart(){
  gameActive = true;

  Score =0;
  streak =0;
  lostCount=0;
  lastword= null;

  InputWordElement.value = '';
  InputWordElement.disabled = false;

  startRound();
  hideOverlay();
}

function paused(){
  if(!gameActive) return;
  isPaused = true;
  InputWordElement.disabled = true;
  showResumeUI();
  showOverlay("Paused");
}

function resumed(){ 
  if(!gameActive) return;
  isPaused= false;
  InputWordElement.disabled = false;
  InputWordElement.focus();
  hideResumeUI();
  hideOverlay();
}

function showResumeUI(){
  resumeElement.style.display='block';
}
function hideResumeUI(){
  resumeElement.style.display='none';
}

function togglePause(){
  if(!gameActive) return;
  isPaused = !isPaused;
  if(isPaused)
  {
   paused();
  }
  else
  {
  resumed();
  }
}

function GameOver(){
  if(!gameActive) return;

  gameActive = false;
  SetHighScore();
  SetHighStreak();
  clearInterval(timerId);
  InputWordElement.disabled = true;
  pauseElement.disabled = true;
  pauseElement.style.display = "none";
  Showrestart();
  showOverlay("Game Over!")
}
    