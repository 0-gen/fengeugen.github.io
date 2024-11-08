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

let lastPositions = []; // Array to store the last positions
const xMovesAgo = 2; // Number of moves to consider for angle calculation
let timeout; // Variable to store the timeout reference
let currentAngle = 0; // Initialize the current angle
const rotationThreshold = 5; // Degrees to trigger rotation
const smokeDuration = 2000; // Duration for smoke removal

function throttle(func, limit) {
  let lastFunc;
  let lastRan;

  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Function to handle the custom cursor and smoke effect
function handleMouseMove(event) {
  const cursorElement = document.querySelector('.custom-cursor'); // Get the cursor element
  const mouseX = event.clientX + window.scrollX; // Get mouse X position with scroll
  const mouseY = event.clientY + window.scrollY; // Get mouse Y position with scroll

  // Update the last positions array
  lastPositions.push({ x: mouseX, y: mouseY });

  // Keep only the last xMovesAgo positions
  if (lastPositions.length > xMovesAgo + 1) {
    lastPositions.shift(); // Remove the oldest position if the limit is exceeded
  }

  // Ensure there are enough positions to calculate the angle
  if (lastPositions.length < xMovesAgo + 1) {
    return; // Not enough data to calculate the angle
  }

  // Calculate the change in position from x moves ago
  const deltaX = lastPositions[lastPositions.length - 1].x - lastPositions[0].x;
  const deltaY = lastPositions[lastPositions.length - 1].y - lastPositions[0].y;

  // Calculate the target angle of rotation based on the change in position
  let targetAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

  // Calculate the shortest angle difference and update the current angle
  const angleDifference = shortestAngleDifference(currentAngle, targetAngle);

  // Only apply rotation if the change is significant
  if (Math.abs(angleDifference) > rotationThreshold) {
    currentAngle += angleDifference; // Update current angle based on the difference
    cursorElement.style.transform = `rotate(${currentAngle}deg)`; // Apply rotation
  }

  // Calculate the rocketship's tip offset relative to its rotation
  const cursorWidth = cursorElement.offsetWidth;
  const cursorHeight = cursorElement.offsetHeight;

  // Offset the custom cursor so the tip is at the mouse pointer
  const radians = (currentAngle - 90) * (Math.PI / 180); // Convert angle to radians
  const offsetX = (cursorWidth / 4) * Math.cos(radians); // Horizontal offset based on rotation
  const offsetY = (cursorHeight / 4) * Math.sin(radians); // Vertical offset based on rotation

  // Update the cursor position, aligning the tip (top-middle) to the mouse pointer
  cursorElement.style.left = `${mouseX - offsetX - 25}px`;
  cursorElement.style.top = `${mouseY - offsetY - 25}px`;
  
  // Reset the timeout to change the angle to 0 degrees after inactivity
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    currentAngle = 0; // Reset current angle
    cursorElement.style.transform = 'rotate(0deg)'; // Change angle to 0 degrees
  }, 500); // Adjust the delay (in milliseconds) as needed

  // Create and position smoke only if needed
  createSmoke(cursorElement);
}

function createSmoke(cursorElement) {
  const cursorRect = cursorElement.getBoundingClientRect();
  const smoke = document.createElement('div');
  smoke.classList.add('smoke-trail'); // Class for smoke trail styling

  // Calculate the position of the smoke (bottom-middle of the cursor)
  const smokeX = cursorRect.left + window.scrollX + cursorRect.width / 2 - smoke.offsetWidth / 2;
  const smokeY = cursorRect.top + window.scrollY + cursorRect.height; // Positioning at the bottom

  // Set smoke position relative to the cursor, accounting for scroll
  smoke.style.left = `${smokeX - 5}px`;
  smoke.style.top = `${smokeY - 30}px`;

  // Append the smoke trail to the body
  document.body.appendChild(smoke);

  // Remove the smoke after the animation finishes (2 seconds)
  setTimeout(() => {
    smoke.remove();
  }, smokeDuration);
}

function shortestAngleDifference(currentAngle, targetAngle) {
  const difference = (targetAngle - currentAngle + 180) % 360 - 180; // Normalize the angle
  return difference;
}

// Create the custom cursor element dynamically
function createCustomCursor() {
  const cursor = document.createElement('img');
  cursor.src = 'Assets/images/smol_rocketship.png'; // Path to the rocketship image
  cursor.classList.add('custom-cursor'); // Add styling
  document.body.appendChild(cursor); // Append to body
}

// Add event listener with throttled function
const throttledMouseMove = throttle(handleMouseMove, 16); // Adjust limit as needed
document.addEventListener('mousemove', throttledMouseMove);
createCustomCursor();