//getting cards from cards.js script
import {cards} from "./cards.js"
let newCards = cards

//function for generating a random card
let unusedCards = []
function generateCard() {
unusedCards = newCards.filter(card => card.used === false )
let cardNum = Math.floor(Math.random()*(unusedCards.length))
let newCard = unusedCards[cardNum]
unusedCards[cardNum].used = true
return newCard
}
//values defined at the start of the program
let dealerTotal = 0
let myTotal = 0
let turnNum = 0
let running = false
let mBust = false
let dBust = false
let mSoftAce = 0
let dSoftAce = 0
let myMoney = 100
let myBet = 0

//game states
function newGame(){
myTotal = 0
dealerTotal = 0
running = true
turnNum = 0
mBust = false
dBust = false
mSoftAce = 0
dSoftAce = 0
while (dealerHand.firstChild) {dealerHand.removeChild(dealerHand.lastChild)}
while (myHand.firstChild) {myHand.removeChild(myHand.lastChild)}
document.getElementById("newgame").hidden = true
newCards = newCards.map(card=>{return {...card, used: false}})
showBetting()
hideButtons()
document.getElementById("betfield").value = ""
document.getElementById("betbutton").innerHTML = "bet"
document.getElementById("mtotal").innerHTML= ""
document.getElementById("dtotal").innerHTML= ""
document.getElementById("deck").innerHTML= "BlackJack"
moneyDisplay()
turnCheck()
}

//a function to show what your money is at
function moneyDisplay() {
    document.getElementById("money").innerHTML = "$" + myMoney.toString()
}
function gameEnd() {
    running = false
    let winner = winCheck()
    
    if (winner === "dealer wins") {myMoney = myMoney - myBet}
    if (winner === "you win") {myMoney = myMoney + myBet}
    if (winner === "tie") { myMoney = myMoney}
    moneyDisplay()

    document.getElementById("newgame").hidden = false
    document.getElementById("deck").innerHTML = winCheck()

}

//functions to check if people have soft aces in their hand
function dSoftAceCheck(){
    if (dealerTotal > 21 && dSoftAce > 0) {
        dSoftAce = dSoftAce -1
        dealerTotal = dealerTotal - 10
    }
}
function mSoftAceCheck() {
    if (myTotal > 21 && mSoftAce > 0) {
        mSoftAce = mSoftAce - 1
        myTotal = myTotal -10
    }
}

//functions for giving new cards to the dealer, and the player as well as adding the total of their cards

const dealerHand = document.getElementById("dealercards")
const cardBack = document.createElement("img")
cardBack.src="./assets/backing.jpg"
function newDCard() {
    let dealersNewCard = generateCard()
    const newImage = document.createElement("img")
    newImage.src="./assets/" + dealersNewCard.imgSrc
    dealerHand.appendChild(newImage)
    if (dealersNewCard.cardVal === "A") {
        if (dealerTotal <= 10){ 
        dealerTotal = dealerTotal + 11
        dSoftAce = dSoftAce + 1
        }
         else {dealerTotal = dealerTotal + 1}
    } else {
            dealerTotal = dealerTotal + dealersNewCard.cardVal
        }
        dSoftAceCheck()
        dBustCheck()
    document.getElementById("dtotal").innerHTML = dealerTotal
}
const myHand = document.getElementById("mycards")
function newMeCard() {
    let myNewCard = generateCard()
const newImage = document.createElement("img")
newImage.src="./assets/" + myNewCard.imgSrc
myHand.appendChild(newImage)
if (myNewCard.cardVal === "A") {
    if (myTotal <=10) {
        myTotal = myTotal +11
        mSoftAce = mSoftAce + 1
    }
    else {myTotal = myTotal + 1}
    }
    else 
    {myTotal = myTotal + myNewCard.cardVal}
    mSoftAceCheck()
    mBustCheck()
document.getElementById("mtotal").innerHTML = myTotal
}

//functions which hide and show the "hit" and "stand" buttons, also the betting fields
function hideButtons(){
    document.getElementById("hit").hidden = true
    document.getElementById("stand").hidden = true
}
function showButtons() {
    document.getElementById("hit").hidden = false
    document.getElementById("stand").hidden = false
}
function hideBetting() {
    document.getElementById("betbutton").hidden = true
    document.getElementById("betfield"). hidden = true
}
function showBetting() {
    document.getElementById("betbutton").hidden = false
    document.getElementById("betfield"). hidden = false
}

//functions which specify whose turn it is or which of the dealer's turns it is
function betting() {
    hideButtons()
    showBetting()
}
function dTurnOne(){ 
hideButtons()
newDCard()
dealerHand.appendChild(cardBack)
turnNum = 2

}
function myTurn() {
    newMeCard()
    newMeCard()
    showButtons()
}
function dTurnTwo() {
    dealerHand.removeChild(cardBack)
    while (turnNum === 3) {if (dealerTotal < 16) {newDCard()} else {turnNum = 4; break}}; 
    turnNum = 4
    
}

//functions which are run upon pressing either the "hit" or "stand" buttons
function hitMe(){
    newMeCard()
}
function standMe(){
    hideButtons();
    turnNum = 3
    turnCheck()
}

//function that checks if your bet is good or not
function getBet() {
    let proposedBet = document.getElementById("betfield").value
    if (isNaN(proposedBet) === true) {document.getElementById("betbutton").innerHTML = "error";
        return "bad bet"}
    else {
        if (Number(proposedBet) > myMoney) {document.getElementById("betbutton").innerHTML = "error";
            return "bad bet"}
        if (Number(proposedBet) <= 0) {document.getElementById("betbutton").innerHTML = "error";
            return "bad bet"
        }
        else {return Number(proposedBet)}
     }
}

//function that runs when you hit bet button
function pressBet() {
    let bet = getBet()
    if (isNaN(bet) === false) {
        myBet = bet
        hideBetting()
        turnNum = 1
        turnCheck()
    }
}
//function which sets up the turn system
function turnCheck() {
    if (turnNum === 0) {betting}
    if (turnNum === 1) {dTurnOne()}
    if (turnNum === 2) {myTurn()}
    if (turnNum === 3) {dTurnTwo()}
    if (turnNum === 4) {gameEnd()}
}

//a function to check if someone busted
function dBustCheck(){
    if (dealerTotal > 21) {
        dBust = true
        turnNum = 4
    }
}
function mBustCheck(){
    if (myTotal > 21) {
        mBust = true
        hideButtons()
        turnNum = 3
        turnCheck()
    }
}
//a function that will check who won the game
function winCheck() {
    if (mBust === false && dBust === false) {
         if (dealerTotal > myTotal) {return "dealer wins"}
        if (myTotal > dealerTotal) {return "you win"}
        if (myTotal === dealerTotal) {return "tie"}
    }
    if (mBust == true && dBust === false) {return "dealer wins"}
    if (mBust === false && dBust === true) {return "you win"}
    if (mBust === true && dBust === true) {return "tie"}
    }

//function which sets up the buttons and runs the "newGame" function
function setUp() {
document.getElementById("hit").onclick = hitMe;
document.getElementById("stand").onclick = standMe;
document.getElementById("newgame").onclick = newGame;
document.getElementById("betbutton").onclick = pressBet;
document.getElementById("betfield").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        document.getElementById("betbutton").click()
    }
    })

newGame();

}
window.onload = setUp
