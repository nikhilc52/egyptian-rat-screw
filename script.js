const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

let deck = [];
let playerDecks = [];
let burn = [];

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


// document.getElementById("frontCard").addEventListener("change", () => {
//     console.log('test');
// });


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
    document.getElementById("deckCounter").innerText = deck.length + burn.length;
}

function takeCards(player) {
    playerDecks[player - 1] = playerDecks[player - 1].concat(deck);
    playerDecks[player - 1] = playerDecks[player - 1].concat(burn);
    document.getElementById("frontCard").src = "svg_playing_cards/playing_deck.svg";
    document.getElementById("middleCard").src = "";
    document.getElementById("backCard").src = "";
    document.getElementById("burnedCard").src = "svg_playing_cards/burned_cards.svg";
    burn = [];
    deck = [];
    document.getElementById("deckCounter").innerText = deck.length + burn.length;
    document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
    return;
}

function check() {
    try {
        if (deck[deck.length - 1].value == 10) {
            return true;
        }

        //Check sum 10
        if (parseInt(deck[deck.length - 1].value) + parseInt(deck[deck.length - 2].value) == 10) {
            return true;
        }

        //Check doubles
        if (parseInt(deck[deck.length - 1].value) == parseInt(deck[deck.length - 2].value)) {
            return true;
        }

        //Check marriage
        if (deck[deck.length - 1].value == 12 && deck[deck.length - 2].value == 13 ||
            deck[deck.length - 1].value == 13 && deck[deck.length - 2].value == 12) {
            return true;
        }

        //Check sandwich
        if (deck[deck.length - 1].value == deck[deck.length - 3].value) {
            return true;
        }
    }
    catch (error) {
        return false;
    }
}

function burnCard(player) {
    let burnedCard = playerDecks[player - 1][playerDecks[player - 1].length - 1].suit + "_" + playerDecks[player - 1][playerDecks[player - 1].length - 1].value;
    burn.push(playerDecks[player - 1].pop());
    document.getElementById("burnedCard").src = "svg_playing_cards/fronts/" + burnedCard + ".svg";
    document.getElementById("deckCounter").innerText = deck.length + burn.length;
    document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
}

function hit(player) {
    if (check()) {
        takeCards(player);
    }
    else {
        burnCard(player);
    }
}