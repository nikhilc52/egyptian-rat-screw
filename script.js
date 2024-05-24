//initial arrays to hold fields
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

//holds the deck in the middle
let deck = [];
//holds the two player decks, player one is in index 0, player 2 is in index 1
let playerDecks = [];
//holds the burned cards deck
let burn = [];
//indicates whether or not the player is allowed to play at the current state
let playerTurn;
//number of ms for the CPU to react (higher, easier)
let difficulty = document.getElementById("difficultySlider");
let difficultyNumber = document.getElementById("difficultyNumber");
difficulty.oninput = function() {
    if(this.value >= 100 && this.value <= 750){
        difficultyNumber.innerText = "Hard";
    }
    if(this.value >= 751 && this.value <= 1500){
        difficultyNumber.innerText = "Normal";
    }
    if(this.value >= 1501){
        difficultyNumber.innerText = "Easy";
    }
}

//populate the middle deck
for (let suit of suits) {
    for (let value of values) {
        let card = {
            value: value,
            suit: suit
        };
        deck.push(card);
    }
}

//start the game with two players
start(2);

//shuffle array function
function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

//starts the game with 'players' players. 
function start(players) {
    shuffle(deck);

    //populate playerDecks with the number of players
    for (let i = 1; i <= players; i++) {
        playerDecks.push([]);
    }

    //splits the deck into two (can be changed with more than 2 players)
    for (let i = 1; i <= 52; i++) {
        if (i % players == 0) {
            playerDecks[0].push(deck.pop());
        }
        else if (i % players == 1) {
            playerDecks[1].push(deck.pop());
        }
    }

    //sets each counter to the appropriate deck value
    for (let i = 1; i <= players; i++) {
        document.getElementById("counter" + i).innerText = playerDecks[i - 1].length;
    }
    playerTurn = true;
    document.getElementById("turn1").innerText = '*';
}

//puts a card in the middle deck, updates counters.
function play(player) {
    if(player == 1){
        document.getElementById("turn2").innerText = '*';
        document.getElementById("turn1").innerText = '';
    }
    else if (player == 2){
        document.getElementById("turn1").innerText = '*';
        document.getElementById("turn2").innerText = '';
    }

    //if the player is allowed to go
    if (playerTurn) {
        //shuffle the player deck
        shuffle(playerDecks[player - 1]);
        //find the front of the deck
        let frontCard = playerDecks[player - 1][playerDecks[player - 1].length - 1].suit + "_" + playerDecks[player - 1][playerDecks[player - 1].length - 1].value;

        //if statements to make sure that the deck appears properly with less than 3 elements
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

        //push the new card onto the deck
        deck.push(playerDecks[player - 1].pop());

        //change the various counters
        document.getElementById("frontCard").src = "svg_playing_cards/fronts/" + frontCard + ".svg";
        document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
        document.getElementById("deckCounter").innerText = deck.length + burn.length;

        //the current players turn is over
        playerTurn = false;

        //if the player was the user, then wait one second, check if the CPU should take the cards, and then play
        if (player == 1) {
            sleep(difficulty.value).then(() => {
                if (check()) {
                    takeCards(2);
                    playerTurn = true; //doesn't fit spec, should ideally be removed/replaced with a better lock
                    play(2);
                }
                else {
                    playerTurn = true; //doesn't fit spec, should ideally be removed/replaced with a better lock
                    play(2);
                }
            });
        } // otherwise, if the player was the CPU, indicate that the player can now play, wait one second, then take the cards if needed
        else if (player == 2) {
            playerTurn = true;
            sleep(difficulty.value).then(() => {
                if (check()) {
                    takeCards(2);
                    play(2);
                }
            });
        }
    }
}

//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//takes the cards from the deck and the burn pile and adds them to the player's deck
function takeCards(player) {
    //concat the decks
    playerDecks[player - 1] = playerDecks[player - 1].concat(deck);
    playerDecks[player - 1] = playerDecks[player - 1].concat(burn);

    //update the visuals
    document.getElementById("frontCard").src = "svg_playing_cards/playing_deck.svg";
    document.getElementById("middleCard").src = "";
    document.getElementById("backCard").src = "";
    document.getElementById("burnedCard").src = "svg_playing_cards/burned_cards.svg";

    //update the decks
    burn = [];
    deck = [];

    //update the counters
    document.getElementById("deckCounter").innerText = deck.length + burn.length;
    document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
}

//checks to see if there is a reason to take the deck
function check() {
    //if there's every an error reading the values, then there wasn't a reason to take the cards
    try {
        //Check if 10
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

//burns a card if the player hits on accident
function burnCard(player) {
    //find the card to be burned
    let burnedCard = playerDecks[player - 1][playerDecks[player - 1].length - 1].suit + "_" + playerDecks[player - 1][playerDecks[player - 1].length - 1].value;

    //push that card to the burned pile
    burn.push(playerDecks[player - 1].pop());

    //update the visuals
    document.getElementById("burnedCard").src = "svg_playing_cards/fronts/" + burnedCard + ".svg";

    //update the counters
    document.getElementById("deckCounter").innerText = deck.length + burn.length;
    document.getElementById("counter" + player).innerText = playerDecks[player - 1].length;
}

//hits for the player
function hit(player) {
    //if there is a reason to hit, then take the cards
    if (check()) {
        takeCards(player);
    } //otherwise, if the deck has more than one card in it (to avoid second-place hits being regarded as burns), burn a card 
    else if (!check() & deck.length > 1) {
        burnCard(player);
    }
}