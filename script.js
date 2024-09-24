document.addEventListener('mousemove', (event) => {
    const rocket = document.getElementById('rocketship');
    rocket.style.left = `${event.clientX}px`;
    rocket.style.top = `${event.clientY}px`;
  });
  