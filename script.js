"use strict";

const tinderContainer = document.querySelector(".tinder");
const allCards = document.querySelectorAll(".tinder--card");
const nope = document.getElementById("nope");
const love = document.getElementById("love");

function initCards() {
  const newCards = document.querySelectorAll(".tinder--card:not(.removed)");

  newCards.forEach((card, index) => {
    card.style.zIndex = allCards.length - index;
    card.style.transform =
      `scale(${(20 - index) / 20}) translateY(-${30 * index}px)`;
    card.style.opacity = (10 - index) / 10;

    // Initialize slideshow
    initSlideshow(card);
  });

  tinderContainer.classList.add("loaded");
}

function initSlideshow(card) {
  const slides = card.querySelectorAll(".slide");
  let currentSlide = 0;

  function showNextSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
    setTimeout(showNextSlide, 3000); // Change slide every 3 seconds
  }

  showNextSlide(); // Start the slideshow
}

function triggerAnimation(animationType) {
  const cards = document.querySelectorAll(".tinder--card:not(.removed)");

  if (!cards.length) return false;

  const card = cards[0];
  const slides = card.querySelectorAll(".slide");

  // Apply the animation class based on the action
  if (animationType === 'love') {
    card.classList.add("tinder_love");
    slides.forEach(slide => slide.classList.add("active"));
  } else if (animationType === 'nope') {
    card.classList.add("tinder_nope");
    slides.forEach(slide => slide.classList.add("active"));
  }

  card.classList.add("removed");
  setTimeout(() => {
    card.classList.remove("tinder_love", "tinder_nope");
    slides.forEach(slide => slide.classList.remove("active"));
    initCards();
  }, 1000); // Time to match the animation duration
}

allCards.forEach((el) => {
  const hammertime = new Hammer(el);

  hammertime.on("pan", (event) => {
    el.classList.add("moving");

    if (event.deltaX === 0) return;
    tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);
    tinderContainer.classList.toggle("tinder_nope", event.deltaX < 0);

    const xMulti = event.deltaX * 0.03;
    const yMulti = event.deltaY / 80;
    const rotate = xMulti * yMulti;

    event.target.style.transform =
      `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
  });

  hammertime.on("panend", (event) => {
    el.classList.remove("moving");
    tinderContainer.classList.remove("tinder_love", "tinder_nope");

    const moveOutWidth = document.body.clientWidth;
    const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    if (keep) {
      event.target.style.transform = "";
    } else {
      const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      const toX = event.deltaX > 0 ? endX : -endX;
      const endY = Math.abs(event.velocityY) * moveOutWidth;
      const toY = event.deltaY > 0 ? endY : -endY;
      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;

      event.target.style.transform =
        `translate(${toX}px, ${toY + event.deltaY}px) rotate(${rotate}deg)`;
      initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {
    triggerAnimation(love ? 'love' : 'nope');
    event.preventDefault();
  };
}

const nopeListener = createButtonListener(false);
const loveListener = createButtonListener(true);

nope.addEventListener("click", nopeListener);
love.addEventListener("click", loveListener);

initCards();

