
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

const sidebar = document.querySelector(".sidebar");
const showContactsButton = document.querySelector(".info_more-btn");

showContactsButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

const track = document.querySelector(".carousel-track");

let position = 0;

function slidePhotos() {
    position -= 1;

    track.style.transform = `translateX(${position}px)`;

    // Reset once the photos have moved far enough
    if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0;
        track.style.transition = "none";
        track.style.transform = "translateX(0)";

        requestAnimationFrame(() => {
            track.style.transition = "transform 0.1s linear";
        });
    }
}

setInterval(slidePhotos, 30);