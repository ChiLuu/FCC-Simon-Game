let colors = ['red-active', 'blue-active', 'yellow-active', 'green-active'];    // Active class to add for lighting up squares.
let buttonSound = new Audio();                                                  // Audio variable to play audio.
let sounds =   ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',        // Audio files from FreeCodeCamp
                'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3', 
                'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3', 
                'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'];
let clickColor = '';                // Square color that was clicked.
const MAX_COLORS = 4;               // Maximum number of colors available for game.
let simonColor = -1;                // Random Simon's sequence's color.         
let simonSequence = []              // Simon's sequence of colors.    
let simonInterval;                  // Interval to display each color and sound in Simon's sequence.         
let currentColor = -1;              // Counter to iterate through Simon's Sequence to match against player's input.  
let playerSequence = [];            // Player's sequence of colors.     
let level = 0;                      // Level of current game, also the number of sequences in Simon's sequence.     
let inplay = false;                 // Session is in play for player's input or pause during replay of Simon's sequence.
let strict = false;                 // Strict mode for when player wants a challenge. Any mistake will reset entire Simon's sequence and player has to start over from the beginning.
let gameOn = true;                  // Game is active if true and inactive if false.
let gamePlus = false;               // Allow player to continue after level 20.
let winningLevel = 3;
let errorMessage = ["Wrong! Let's try again.",          // Random error messages 
                    "Wrong! Are you really trying?", 
                    "Wrong! Maybe you need a coffee?", 
                    "Wrong! What's the rush?", 
                    "Wrong! Need a break?", 
                    "Wrong! This is your best?",
                    "Wrong! Soooooo close...",
                    "Wrong! Hahaha hahaha",
                    "Wrong! Did you eat yet?",
                    "Wrong! Maybe you need a Snicker?",
                    "Wrong! But you're almost right!",
                    "Wrong! Wrong! Wrong! Wrong!",
                    "Wrong! Hello my wrong friend.",
                    "Wrong! $#*@$^# &*$^@# Wrong!"];

$(document).ready(function() {
  
    // Player click and button light up.
    $(".square").click(function(){
        
        // Only allow player to click if there is a Simon's sequence to play.
        if(playerSequence.length < level && inplay) {

            clickColor = $(this).attr('id');
            lightUp(clickColor);
            playerSequence.push(clickColor);

            // If player's sequence matches Simon's sequence, then add next simon's color.
            if(playerSequence[currentColor] == simonSequence[currentColor] && playerSequence.length == simonSequence.length) {
                
                if(level == winningLevel && !gamePlus) {
                    $(".winner").show("slide", {direction: "down"}, 1000);
                } else {
                    initiateSequence();
                    setTimeout(() => {
                        startSimon();
                    }, 1000);
                }
            }
            else if(strict && playerSequence[currentColor] != simonSequence[currentColor]) {
                simonSequence = [];
                initiateSequence();
                $(".error").html(errorMessage[randomColor(errorMessage.length)]);
                $(".error").show();
                setTimeout(() => {
                    $(".error").hide();
                    startSimon();
                }, 2500);
            }
            // Show error if player entered wrong color and then play Simon's sequence again.
            else if(playerSequence[currentColor] != simonSequence[currentColor]) {
                
                $(".error").html(errorMessage[randomColor(errorMessage.length)]);
                $(".error").show();
                currentColor = 0;
                playerSequence = [];
                inplay = false;

                setTimeout(() => {
                    $(".error").hide();
                    startSimon();
                }, 2500);
            }

            // If color matches and player hasn't match all of Simon's sequence yet, then move onto next color verification.
            else {
                currentColor ++;
            }
        }
        
    });

    // Start Simon Sequence if game is switched on.
    $(".start").click(function() {

        if(gameOn && !simonSequence.length) {
            // Set up initial condition for Simon's game.
            initiateSequence();
            $(".start").addClass("button-start-active");
            
            // Play audio and add to sequence.
            setTimeout(() => {
                startSimon();
            }, 500);
        }
    });

    // Strict mode option for player that will reset game for a single mistake.
    $(".strict").click(function() {
        if(strict){
            strict = false;
            $(".strict").removeClass("button-strict-active");
        } else {
            strict = true;
            $(".strict").addClass("button-strict-active");
        }
    });

    // Switch to turn on current game.
    $(".switch-on").click(function() {
        if(!gameOn) {
            gameOn = true;
            $(".switch-on").removeClass("button-on-deactive");
            $(".switch-off").removeClass("button-off-active");
        }
    });
    

    // Switch to keep game turned off and/or reset current game.
    $(".switch-off").click(function() {
        if(gameOn) {
            gameOn = false;
            clearInterval(simonInterval);
            $(".switch-on").addClass("button-on-deactive");
            $(".switch-off").addClass("button-off-active");
            $(".start").removeClass("button-start-active");
            inplay = false;
            playerSequence = [];  
            simonSequence = [];  
            level = simonSequence.length;
            $(".level").html("00");
            gamePlus = false;
        }
    });

    // Continue game from level 20 onwards.
    $(".continue").click(function() {
        $(".winner").hide();
        initiateSequence();
        setTimeout(() => {
            startSimon();
        }, 1000);
        gamePlus = true;
    });
    $(".reset").click(function() {
        $(".winner").hide();
        clearInterval(simonInterval);
        simonSequence = [];
        initiateSequence();
        setTimeout(() => {
            startSimon();
        }, 2500);
    });
});

// Light up square and play sound according to it's color.
function lightUp(color) {
    console.log("color in lightUp: " + color);
    $("#" + color).addClass(colors[color]);
    buttonSound = new Audio(sounds[color]);
    buttonSound.play();

    setTimeout(function() {
        $("#" + color).removeClass(colors[color]);
    }, 500);
}

/* Generate a random number from 0 - num */
function randomColor(num) {
    return Math.floor(Math.random() * num);
}


/* Play throught each color in Simon's sequence */
function startSimon() {

    simonInterval = setInterval(function() {
            
        simonColor = simonSequence[currentColor];
        console.log("simonColor: " + simonColor);
        console.log("currentColor: " + currentColor);
        lightUp(simonColor);
        currentColor++;

        if(currentColor == level) {
            clearInterval(simonInterval);
            currentColor = 0;
            inplay = true;
        }
    }, 1000);
}

function initiateSequence() {
    simonColor = randomColor(MAX_COLORS);
    simonSequence.push(simonColor);
    currentColor = 0;
    level = simonSequence.length;
    console.log("level: " + level);
    inplay = false;
    playerSequence = [];
    $(".level").html(level);
}