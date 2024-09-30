// Function to handle the slide transition to the about section
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

// Function to slide back to the intro section
function slideToIntro() {
    const introSection = document.getElementById('intro');
    const aboutSection = document.getElementById('about');

    // Add slide-out-to-right animation to about section
    aboutSection.classList.add('slideOutRight');

    // Wait for the slide-out animation to complete
    aboutSection.addEventListener('animationend', () => {
        aboutSection.style.display = 'none'; // Hide about section after sliding out
        aboutSection.classList.remove('slideOutRight'); // Remove the class to reset

        // Show the intro section with slide-in-from-left animation
        introSection.style.display = 'flex'; 
        introSection.classList.add('slideInLeft');

        // Remove the class after the animation finishes
        introSection.addEventListener('animationend', () => {
          introSection.classList.remove('slideInLeft');
        }, { once: true });
    }, { once: true }); // Ensure the event only fires once
}

function showMoons(moonListId, planetElement) {
  const moonList = document.getElementById(moonListId);
  
  // Hide all other moon lists
  const moonLists = document.querySelectorAll('.moon-list');
  moonLists.forEach(list => {
    if (list.id !== moonListId) {
      list.classList.add('hidden');
    }
  });

  // Toggle the visibility of the clicked moon list
  if (moonList.classList.contains('hidden')) {
    moonList.classList.remove('hidden');
  } else {
    moonList.classList.add('hidden');
  }
}

// To close the overlay and moon list on click
overlay.addEventListener('click', function() {
  overlay.classList.remove('visible'); // Hide overlay
  const allMoonLists = document.querySelectorAll('.moon-list');
  allMoonLists.forEach((list) => {
    list.classList.add('hidden'); // Hide all moon lists
  });
});

// Function to handle clicks on moon list items
function handleMoonItemClick(event) {
  event.stopPropagation(); // Prevent event from bubbling up to the overlay
}

// Add this function to your moon list item click handlers
const moonItems = document.querySelectorAll('.moon-list li');
moonItems.forEach(item => {
  item.addEventListener('click', handleMoonItemClick);
});

function toggleSubmenu(submenuId) {
  const submenu = document.getElementById(submenuId);
  if (submenu.classList.contains('hidden')) {
    submenu.classList.remove('hidden');
  } else {
    submenu.classList.add('hidden');
  }
}

