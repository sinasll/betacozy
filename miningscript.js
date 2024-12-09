let miningAmount = parseFloat(localStorage.getItem('miningAmount')) || 0.00; // Get the saved mining amount from localStorage or default to 0.00
let miningRate = 10 / 3600; // Rate at which mining increases (10 COZY per hour, converted to per second)
let miningStartTime = parseFloat(localStorage.getItem('miningStartTime')) || Date.now(); // Track when mining started
let maxMiningTime = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

// Function to update the displayed mining amount
function updateMiningAmount() {
    const miningAmountElement = document.getElementById('miningAmount');
    miningAmountElement.innerText = miningAmount.toFixed(2);
    console.log(`Updated Mining Amount: ${miningAmount.toFixed(2)}`); // Debugging line
    localStorage.setItem('miningAmount', miningAmount.toFixed(2)); // Save the updated mining amount to localStorage
}

// Function to update the mining power display
function updateMiningPower() {
    const powerElement = document.getElementById('Power');
    powerElement.innerText = `BRONZE mining 10x1hour`; // Display the mining power as fixed rate
}

// Function to check if the mining should stop after 8 hours
function checkMiningTimeout() {
    const elapsedTime = Date.now() - miningStartTime;
    if (elapsedTime >= maxMiningTime) {
        clearInterval(miningInterval); // Stop the mining process after 8 hours
        console.log("Mining stopped after 8 hours due to inactivity.");
    }
}

// Mining process: Simulate mining by increasing the amount over time (10 COZY per hour)
let miningInterval = setInterval(() => {
    miningAmount += miningRate; // Increase mining amount based on the rate
    updateMiningAmount();
    checkMiningTimeout(); // Check if mining should stop
}, 1000); // Update every second

// Claiming process: reset the mining amount and add the amount to the player's score
function Claim() {
    console.log(`Claiming: ${miningAmount.toFixed(2)} COZY`); // Debugging line
    
    // Retrieve the player's current score and username from localStorage
    let playerUsername = localStorage.getItem('username');
    let playerScore = parseFloat(localStorage.getItem('score')) || 0.00; // Default score to 0 if not set

    // Add the mining amount to the player's score
    playerScore += miningAmount;

    // Save the new score and reset mining variables in localStorage
    localStorage.setItem('score', playerScore.toFixed(2)); // Save updated score
    localStorage.setItem('miningAmount', 0.00); // Reset mining amount
    localStorage.setItem('miningStartTime', Date.now()); // Reset mining start time
    
    // Update the score display and reset mining amount
    updateMiningAmount();
    console.log(`${playerUsername} has claimed ${miningAmount.toFixed(2)} COZY! New score: ${playerScore.toFixed(2)}`);

    // Restart the mining process after claiming
    miningAmount = 0.00;
    miningStartTime = Date.now(); // Reset mining start time for the new session
    localStorage.setItem('miningAmount', miningAmount);
    localStorage.setItem('miningStartTime', miningStartTime);
    clearInterval(miningInterval); // Stop the previous mining interval
    miningInterval = setInterval(() => {  // Restart the mining process
        miningAmount += miningRate;
        updateMiningAmount();
        checkMiningTimeout();
    }, 1000); // Update every second
}

// Start mining when the page loads
window.onload = () => {
    console.log("Window loaded. Starting mining..."); // Debugging line

    // Calculate the time elapsed since the mining started
    const elapsedTime = Date.now() - miningStartTime;
    if (elapsedTime < maxMiningTime) {
        // Resume mining if less than 8 hours have passed
        miningInterval = setInterval(() => {
            miningAmount += miningRate;
            updateMiningAmount();
            checkMiningTimeout();
        }, 1000);
    } else {
        // Stop mining if the 8 hours are over
        clearInterval(miningInterval);
        console.log("Mining stopped after 8 hours due to inactivity.");
    }
    
    // Update the mining power display
    updateMiningPower();
};
