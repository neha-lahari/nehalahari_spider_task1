const TOTAL_SWING = 1.0, LEFT = -90, RIGHT = 90, CENTER = 0;
let isSwinging, isStopped, angle, mode, player, scores, interval;
//this function is for  variable speed and realistic motion
function ease(p) {
    return 0.5 - 0.5 * Math.cos(Math.PI * p);
}
function moveStick(a) {
    document.getElementById('stick').style.transform = `rotate(${a}deg)`;
    angle = a;
}
//for swing animation of the stick
function swing() {
    if (!isSwinging) return;
    let t = ((Date.now() / 1000) % (TOTAL_SWING * 2)) / TOTAL_SWING;
    if (t > 1) t = 2 - t;
    moveStick(LEFT + (RIGHT - LEFT) * ease(t));
}
//start the swing
function startSwing() {
    isSwinging = true;
    isStopped = false;
    interval = setInterval(swing, 16);
}
//stop the swing and calculating thw score part and updating part
document.getElementById('swingBtn').onclick = stopSwing;
function stopSwing() {
    if (isStopped || !isSwinging) return;
    clearInterval(interval);
    isSwinging = false;
    isStopped = true;
    animateHammer();
    let s = Math.max(0, 100 - Math.round(Math.abs(angle - CENTER) / 90 * 100));
    if (mode === 'single') {
        showScore(`Score: ${s}`);
    } else {
        scores[player - 1] = s;
        showScore('');
        document.getElementById('scoreDisplay').style.display = 'none';
        document.getElementById('score' + player).textContent = s;
        if (player === 1) showNext();
        else showWinner();
    }
    document.getElementById('swingBtn').disabled = true;
}
//to animate the hammer when the swing stops
function animateHammer() {
    const hammer = document.querySelector('.hammer-img');
    hammer.classList.add('hammer-strike');
    setTimeout(() => {
        hammer.classList.remove('hammer-strike');
    }, 180);
}
//for next player
function showNext() {
    document.getElementById('nextBtn').style.display = '';
}//winner message
function showWinner() {
    let [a, b] = scores;
    let aDisplay = (a === null || a === undefined) ? '-' : a;
    let bDisplay = (b === null || b === undefined) ? '-' : b;
    let msg;
    if (a === null && b !== null) msg = "Player 2 Wins!"; // Only Player 2 played
    else if (b === null && a !== null) msg = "Player 1 Wins!"; // Only Player 1 played
    else if (a > b) msg = "Player 1 Wins!";
    else if (b > a) msg = "Player 2 Wins!";
    else msg = "It's a Tie!";
    document.getElementById('winnerBox').textContent = `${msg} (${aDisplay} vs ${bDisplay})`;
    document.getElementById('winnerBox').style.display = '';
    document.getElementById('nextBtn').style.display = 'none';
}//to show the score in single player mode
function showScore(txt) {
    const scoreDiv = document.getElementById('scoreDisplay');
    scoreDiv.textContent = txt;
    if (mode === 'single') {
        scoreDiv.style.display = '';
    } else {
        // Always hide in 2 player mode
        scoreDiv.style.display = 'none';
    }
}//reset option
document.getElementById('resetBtn').onclick = () => reset();
function reset(turn = false) {
    clearInterval(interval);
    document.getElementById('swingBtn').disabled = false;
    document.getElementById('winnerBox').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    showScore('');
    if (mode === 'two') {
        if (!turn) player = 1;
        document.getElementById('playerTurn').textContent = `Player ${player}'s Turn`;
        document.getElementById('playerTurn').style.display = '';
        document.getElementById('twoScores').style.display = '';
        document.getElementById('scoreDisplay').style.display = 'none';
        if (!turn) {
            scores = [null, null];
            document.getElementById('score1').textContent = '-';
            document.getElementById('score2').textContent = '-';
        }
    } else {
        document.getElementById('playerTurn').style.display = 'none';
        document.getElementById('twoScores').style.display = 'none';
        document.getElementById('scoreDisplay').style.display = '';
    }
    startSwing();
}//toset the game mode
// to start with single player
setMode('single');
document.getElementById('singleBtn').onclick = () => setMode('single');
document.getElementById('twoBtn').onclick = () => setMode('two');
function setMode(m) {
    mode = m; player = 1; scores = [null, null];
    document.getElementById('singleBtn').classList.toggle('active', m === 'single');
    document.getElementById('twoBtn').classList.toggle('active', m === 'two');
    reset();
}

document.getElementById('nextBtn').onclick = nextTurn;
function nextTurn() {
    if (player === 1 && typeof scores[0] === "number") {
        player = 2;
        reset(true);
    }
}




