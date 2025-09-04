document.addEventListener('DOMContentLoaded', () => {
    // Get the elements we need to animate
    const heroContent = document.getElementById('hero-content');
    const committeeCards = document.getElementById('committeeCards');

    // Add dynamic background images from the data-image attribute
    const allCards = document.querySelectorAll('.committee-card');
    allCards.forEach(card => {
        const imageUrl = card.getAttribute('data-image');
        if (imageUrl) {
            card.style.setProperty('--_image-url', imageUrl);
        }
    });

    // The core animation logic
    // Wait for 2 seconds (2000 milliseconds)
    setTimeout(() => {
        // Fade out the hero content text
        heroContent.style.opacity = '0';

        // Wait a little longer for the fade-out to finish (1 second)
        setTimeout(() => {
            // Hide the hero content to free up space
            heroContent.style.display = 'none';

            // Show the committee cards by adding the 'show' class
            committeeCards.classList.add('show');

            // Make the committee cards visible to screen readers after they appear
            committeeCards.setAttribute('aria-hidden', 'false');

        }, 1000); // Wait 1 second after fading out
    }, 2000); // Wait 2 seconds before starting the fade-out
});

// The rest of your existing script.js code can go here
// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
