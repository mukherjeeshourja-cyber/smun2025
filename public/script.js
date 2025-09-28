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

document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const form = event.target;
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    experience: form.experience.value.trim(),
    institution: form.institution.value.trim(),
    mealPreference: form.mealPreference.value,
    committeePreference1: form.committeePreference1.value.trim(),
    alloPreference1: form.alloPreference1.value.trim(),
    committeePreference2: form.committeePreference2.value.trim(),
    alloPreference2: form.alloPreference2.value.trim(),
    photography: form.photography?.checked || false,
    journalism: form.journalism?.checked || false,
    awards: form.awards.value.trim(),
    doubleName: form.doubleName.value.trim(),
    doublePhone: form.doublePhone.value.trim(),
    doubleEmail: form.doubleEmail.value.trim(),
    doubleMealPreference: form.doubleMealPreference.value,
    doubleExperience: form.doubleExperience.value.trim(),
    doubleAwards: form.doubleAwards.value.trim(),
    doubleInstitution: form.doubleInstitution.value.trim(),
    transactionScreenshot: "", // skip file upload for now
    transactionId: form.transactionId.value.trim(),
    referenceCode: form.referenceCode.value.trim()
  };

  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      document.getElementById('registerSuccess').innerText = 'Registration successful!';
      form.reset();
    } else {
      document.getElementById('registerSuccess').innerText = 'Registration failed. Please try again.';
    }
  } catch (error) {
    document.getElementById('registerSuccess').innerText = 'Error connecting to server.';
    console.error(error);
  }
});
document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);  // FormData automatically handles file input

  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      document.getElementById('registerSuccess').innerText = 'Registration successful!';
      form.reset();
    } else {
      document.getElementById('registerSuccess').innerText = 'Registration failed. Please try again.';
    }
  } catch (error) {
    document.getElementById('registerSuccess').innerText = 'Error connecting to server.';
    console.error(error);
  }
});
