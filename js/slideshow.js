// let slideIndex = 1;
// showSlides(slideIndex);

// // Next/previous controls
// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }

// // Thumbnail image controls
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

// function showSlides(n) {
//   let i;
//   let slides = document.getElementsByClassName("testimonial");
//   let dots = document.getElementsByClassName("dot");
//   if (n > slides.length) {slideIndex = 1}
//   if (n < 1) {slideIndex = slides.length}
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex-1].style.display = "flex";
//   dots[slideIndex-1].className += " active";
// }

let carousel
let carouselItemCount
let carouselItemCurrent
let carouselButtons = []
let carouselCycleTimer
let lastCarouselInteraction = Date.now()

// let carousel

document.addEventListener('DOMContentLoaded', (ev) => {
  //Set Carousel Variables
  carousel = document.getElementById('testimonial-carousel')
  carouselItemCount = carousel.querySelectorAll('.swipeable-item').length
  carouselItemCurrent = 0

  //Make buttons under the carousel
  buttonContainer = document.getElementById('testimonial-carousel-buttons-container')
  for (let i=0; i<carouselItemCount; i++) {
    let newButton = document.createElement('span')
    newButton.classList.add('dot')
    newButton.addEventListener('click', (ev) => {
      testimonialSwipeToPosition(i);
      resetCarouselTimer();
    })
    buttonContainer.appendChild(newButton)
    carouselButtons.push(newButton)
  }
  carouselButtons[carouselItemCurrent].classList.add('active')

  // Add listener to set dot indicator after scrolling (phone browsers allow scrolling by swiping)
  carousel.addEventListener('scroll', adjustHighlightedDotButton)

  //Set Timer to scroll carousel
  initCarouselTimer(10);
});

function testimonialSwipeToPosition(position) {
  carouselButtons[carouselItemCurrent].classList.remove('active')

  position = Math.min(Math.max(0, position), carouselItemCount-1)

  const itemWidth = carousel.querySelector('.swipeable-item').offsetWidth
  const distToScroll = (position - carouselItemCurrent) * itemWidth

  carousel.scrollBy({ left: distToScroll, behavior: "smooth" });
  carouselItemCurrent = position

  carouselButtons[carouselItemCurrent].classList.add('active')
}

function testimonialSwipeLeft() {
  const itemWidth = carousel.querySelector('.swipeable-item').offsetWidth

  carouselButtons[carouselItemCurrent].classList.remove('active')

  if (carouselItemCurrent !== 0) {
    carousel.scrollBy({ left: -itemWidth, behavior: "smooth" });
    carouselItemCurrent -= 1
  } else {
    carousel.scrollBy({ left: itemWidth*(carouselItemCount-1), behavior: "smooth" });
    carouselItemCurrent = carouselItemCount - 1
  }

  carouselButtons[carouselItemCurrent].classList.add('active')
}

function testimonialSwipeRight() {
  const itemWidth = carousel.querySelector('.swipeable-item').offsetWidth

  carouselButtons[carouselItemCurrent].classList.remove('active')

  if (carouselItemCurrent === carouselItemCount -1) {
    carousel.scrollBy({ left: -itemWidth*(carouselItemCount-1), behavior: "smooth" });
    carouselItemCurrent = 0
  } else {
    carousel.scrollBy({ left: itemWidth, behavior: "smooth" });
    carouselItemCurrent += 1
  }

  carouselButtons[carouselItemCurrent].classList.add('active')
}

function adjustHighlightedDotButton() {
  const itemWidth = carousel.querySelector('.swipeable-item').offsetWidth

  const position = Math.round(carousel.scrollLeft / itemWidth)
  carouselItemCurrent = Math.min(Math.max(0, position), carouselItemCount-1)
  carouselButtons.forEach((ele) => {ele.classList.remove('active')})
  carouselButtons[carouselItemCurrent].classList.add('active')
}

function initCarouselTimer(seconds) {
  carouselCycleTimer = setTimeout(() => {
    testimonialSwipeRight();
    initCarouselTimer(10);
  }, 1000 * seconds)
}

function resetCarouselTimer() {
  clearTimeout(carouselCycleTimer)
  initCarouselTimer(20);
}