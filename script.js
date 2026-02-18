// Simple Gallery Auto-Slider
const gallery = document.getElementById('gallery-container');
let scrollAmount = 0;

function autoScrollGallery() {
    if (gallery.scrollWidth - gallery.clientWidth <= scrollAmount) {
        scrollAmount = 0; // reset
    } else {
        scrollAmount += 1; // pixels to scroll
    }
    gallery.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}
setInterval(autoScrollGallery, 50);

// Dynamic Hero Image (if multiple added)
const heroPhoto = document.getElementById('hero-photo');
const heroImages = ['images/main_photo.jpg']; // Add more file paths here

let currentHero = 0;
setInterval(() => {
    if (heroImages.length > 1) {
        currentHero = (currentHero + 1) % heroImages.length;
        heroPhoto.src = heroImages[currentHero];
    }
}, 5000);
