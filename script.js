const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

let deck = [];
// let player1Deck = [];
// let player2Deck = [];
let playerDecks = [];

for (let suit of suits) {
    for (let value of values) {
        let card = {
            value: value,
            suit: suit
        };
        deck.push(card);
    }
}

start(2);

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function start(players) {
    shuffle(deck);
    for (let i = 1; i <= players; i++) {
        playerDecks.push([]);
    }

    for (let i = 1; i <= 52; i++) {
        if (i % players == 0) {
            playerDecks[0].push(deck.pop());
        }
        else if (i % players == 1) {
            playerDecks[1].push(deck.pop());
        }
    }

    for (let i = 1; i <= players; i++) {
        document.getElementById("counter" + i).innerText = playerDecks[i - 1].length;
    }
}

function play(player) {
    shuffle(playerDecks[player - 1]);
    let frontCard = playerDecks[player - 1][playerDecks[player - 1].length - 1].suit + "_" + playerDecks[player - 1][playerDecks[player - 1].length - 1].value;
    if (deck.length == 1) {
        let middleCard = deck[deck.length - 1].suit + "_" + deck[deck.length - 1].value;
        document.getElementById("middleCard").src = "svg_playing_cards/fronts/" + middleCard + ".svg";
    }
    if (deck.length > 1) {
        let middleCard = deck[deck.length - 1].suit + "_" + deck[deck.length - 1].value;
        let backCard = deck[deck.length - 2].suit + "_" + deck[deck.length - 2].value;
        document.getElementById("middleCard").src = "svg_playing_cards/fronts/" + middleCard + ".svg";
        document.getElementById("backCard").src = "svg_playing_cards/fronts/" + backCard + ".svg";
    }

    deck.push(playerDecks[player - 1].pop());

    document.getElementById("frontCard").src = "svg_playing_cards/fronts/" + frontCard + ".svg";
    document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
    document.getElementById("deckCounter").innerText = deck.length;
}

function takeCards(player) {
    playerDecks[player - 1] = playerDecks[player - 1].concat(deck);
    document.getElementById("frontCard").src = "";
    document.getElementById("middleCard").src = "";
    document.getElementById("backCard").src = "";
    deck = [];
    document.getElementById("deckCounter").innerText = deck.length;
    document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
    return;
}

function check(player) {
    // Check 10
    if (deck[deck.length - 1].value == 10) {
        takeCards(player);
    }

    //Check sum 10
    if (parseInt(deck[deck.length - 1].value) + parseInt(deck[deck.length - 2].value) == 10) {
        takeCards(player);
    }

    //Check doubles
    if (parseInt(deck[deck.length - 1].value) == parseInt(deck[deck.length - 2].value)) {
        takeCards(player);
    }

    //Check marriage
    if (deck[deck.length - 1].value == 12 && deck[deck.length - 2].value == 13 ||
        deck[deck.length - 1].value == 13 && deck[deck.length - 2].value == 12) {
        takeCards(player);
    }

    //Check sandwich
    if (deck[deck.length - 1].value == deck[deck.length - 3].value) {
        takeCards(player);
    }
}