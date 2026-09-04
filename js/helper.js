
function slideToAbout() {
    const introSection = document.getElementById('intro');
    const aboutSection = document.getElementById('about');
  
    // Add slide-out-to-left animation to intro
    introSection.classList.add('slideOutLeft');
  
    // Wait for the slide-out animation to complete
    introSection.addEventListener('animationend', () => {
      introSection.style.display = 'none'; // Hide intro section after sliding out
      introSection.classList.remove('slideOutLeft'); // Remove the class to reset

      // Show the about section with slide-in-from-right animation
      aboutSection.style.display = 'block';
      aboutSection.classList.add('slideInRight');
      
      // Remove the class after the animation finishes
      aboutSection.addEventListener('animationend', () => {
        aboutSection.classList.remove('slideInRight');
      }, { once: true });
    }, { once: true }); // Ensure the event only fires once
}
