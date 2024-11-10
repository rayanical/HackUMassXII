function selectDiningHall(diningHallName) {
    // Hide the dining hall selection (button group)
    const diningHallSelection = document.getElementById('diningHallSelection');
    diningHallSelection.style.display = 'none';

    // Show the user input form with a smooth transition
    const userInputForm = document.getElementById('userInputForm');
    userInputForm.style.display = 'block'; // Make the form visible
    userInputForm.style.opacity = '0'; // Start the form with 0 opacity (invisible)

    // Animate the form fading in
    setTimeout(() => {
        userInputForm.style.transition = 'opacity 0.5s ease-in-out'; // Apply transition effect
        userInputForm.style.opacity = '1'; // Fade in the form
    }, 50); // Delay to ensure the display is applied first

    // Set the dining hall name in the h2 element
    document.getElementById('diningHallName').textContent = `Dining Hall: ${diningHallName}`;
}
