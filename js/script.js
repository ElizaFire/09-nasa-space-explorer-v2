 // NASA APOD API (for images and videos)
function getRandomApodApiUrl() {
  // Use only supported parameters
  const apiKey = 'iwePudglvFDZpCjzu5wSLirIgzUIs2NM1OfplPdP'; // User's NASA API key
  const count = 8;
  return `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
}

// Helper to create gallery item for APOD
function createApodGalleryItem(apod) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'gallery-item';

  // Only handle images
  if (apod.media_type === 'image') {
    const img = document.createElement('img');
    img.src = apod.url;
    img.alt = apod.title;
    img.className = 'space-image';
    itemDiv.appendChild(img);

    // Title
    const titleElem = document.createElement('h3');
    titleElem.textContent = apod.title;
    itemDiv.appendChild(titleElem);

    // Date
    const dateElem = document.createElement('p');
    dateElem.textContent = `Date: ${apod.date}`;
    itemDiv.appendChild(dateElem);

    // Modal logic
    itemDiv.addEventListener('click', function() {
      showModal({
        imageUrl: apod.url,
        title: apod.title,
        date: apod.date,
        explanation: apod.explanation || ''
      });
    });
  }

  return itemDiv;
}
// --- Fun Space Facts ---
const spaceFacts = [
  "Did you know? The footprints on the Moon will likely remain for millions of years!",
  "Did you know? Jupiter is so big you could fit all the other planets inside it!",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? Neutron stars can spin 600 times per second!",
  "Did you know? The Sun makes up 99.8% of the mass in our solar system.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Saturn could float in water because it’s mostly gas!",
  "Did you know? The largest volcano in the solar system is on Mars: Olympus Mons.",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The Milky Way galaxy is 105,700 light-years wide!"
];

function showRandomSpaceFact() {
  const factElem = document.getElementById('spaceFact');
  if (factElem) {
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    factElem.textContent = randomFact;
  }
}

// Show a random fact on page load and update every 5 seconds
showRandomSpaceFact();
setInterval(showRandomSpaceFact, 5000);
// Use this URL to fetch NASA Image and Video Library data.
const nasaImagesApi = 'https://images-api.nasa.gov/search?q=moon';

// Helper to create gallery item for NASA Image and Video Library
function createGalleryItem(item) {
  const imageUrl = item.links && item.links[0] ? item.links[0].href : '';
  const dataObj = item.data && item.data[0] ? item.data[0] : {};
  const title = dataObj.title || 'No Title';
  const date = dataObj.date_created ? new Date(dataObj.date_created).toLocaleDateString() : 'No Date';
  const explanation = dataObj.description || 'No Description';

  const itemDiv = document.createElement('div');
  itemDiv.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title;
  img.className = 'space-image';
  // If image fails to load, show a placeholder
  img.onerror = function() {
    img.src = 'img/placeholder.png'; // You can add a placeholder image in the img/ folder
    img.alt = 'Image not available';
  };
  itemDiv.appendChild(img);

  const titleElem = document.createElement('h3');
  titleElem.textContent = title;
  itemDiv.appendChild(titleElem);

  const dateElem = document.createElement('p');
  dateElem.textContent = `Date: ${date}`;
  itemDiv.appendChild(dateElem);

  itemDiv.addEventListener('click', function() {
    showModal({
      imageUrl: imageUrl,
      title: title,
      date: date,
      explanation: explanation
    });
  });

  return itemDiv;
}

// Get references to the button, gallery, and loader elements
const getImageBtn = document.getElementById('getImageBtn');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

// Hide loader on initial page load
if (loader) loader.style.display = 'none';

// Function to fetch and display images
function fetchSpaceImages() {
  loader.style.display = 'flex';
  gallery.innerHTML = '<div class="loading-message"><p>Your beautiful moon images are on the way. 🌚</p></div>';

  fetch(nasaImagesApi)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      setTimeout(() => {
        gallery.innerHTML = '';
        let items = data.collection.items;
        if (!Array.isArray(items) || items.length === 0) {
          gallery.innerHTML = '<p>Sorry, no images were returned. Please try again later.</p>';
          loader.style.display = 'none';
          return;
        }
        // Shuffle items for random selection
        items = items.sort(() => Math.random() - 0.5);
        // Show up to 6 random images
        for (let i = 0; i < Math.min(items.length, 6); i++) {
          gallery.appendChild(createGalleryItem(items[i]));
        }
        loader.style.display = 'none';
      }, 5000);
    })
    .catch(error => {
      console.error('Error fetching NASA images:', error);
      gallery.innerHTML = `<p>Fetch failed: ${error.message}</p>`;
      loader.style.display = 'none';
    });
}


// When the button is clicked, fetch and show images
getImageBtn.addEventListener('click', fetchSpaceImages);

// --- Animated Space Background: Constellations & Twinkling Stars ---
const canvas = document.getElementById('space-bg');
const ctx = canvas.getContext('2d');

// Resize canvas to fill window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star and constellation data
const STAR_COUNT = 120;
const CONSTELLATIONS = [
  // Orion (simple version)
  [ [0.15,0.2], [0.18,0.25], [0.22,0.3], [0.25,0.35], [0.28,0.4], [0.32,0.45] ],
  // Big Dipper
  [ [0.7,0.15], [0.72,0.18], [0.75,0.22], [0.78,0.25], [0.8,0.28], [0.82,0.32], [0.85,0.35] ],
  // Cassiopeia
  [ [0.4,0.7], [0.43,0.68], [0.46,0.72], [0.49,0.68], [0.52,0.7] ]
];

// Generate random stars
const stars = Array.from({length: STAR_COUNT}, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.2 + 0.8,
  twinkleSpeed: Math.random() * 1.5 + 0.5,
  twinklePhase: Math.random() * Math.PI * 2
}));

function drawStarsAndConstellations(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw twinkling stars
  for (const star of stars) {
    // Twinkle by changing alpha
    const twinkle = 0.6 + 0.4 * Math.sin(time/600 * star.twinkleSpeed + star.twinklePhase);
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(star.x * canvas.width, star.y * canvas.height, star.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;

  // Draw constellations
  ctx.strokeStyle = '#C8D6F3';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#FC3D21';
  ctx.shadowBlur = 8;
  for (const constellation of CONSTELLATIONS) {
    ctx.beginPath();
    for (let i = 0; i < constellation.length; i++) {
      const [x, y] = constellation[i];
      const px = x * canvas.width;
      const py = y * canvas.height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      // Draw a star at each point
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FC3D21';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

function animateSpaceBg(time) {
  drawStarsAndConstellations(time);
  requestAnimationFrame(animateSpaceBg);
}
animateSpaceBg();


// Modal logic
// Get modal elements
const imageModal = document.getElementById('imageModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Function to show the modal with image details
function showModal(data) {
  modalImage.src = data.imageUrl;
  modalTitle.textContent = data.title;
  modalDate.textContent = `Date: ${data.date}`;
  modalExplanation.textContent = data.explanation;
  imageModal.style.display = 'block';
}

// Function to close the modal
closeModal.onclick = function() {
  imageModal.style.display = 'none';
};

// Close modal when clicking outside the modal content
window.onclick = function(event) {
  if (event.target === imageModal) {
    imageModal.style.display = 'none';
  }
};
