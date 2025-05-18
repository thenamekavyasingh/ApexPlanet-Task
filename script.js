const button = document.getElementById('alertBtn');

button.addEventListener('click', () => {
  alert('Hello! Thanks for visiting my portfolio.');
});

let slideIndex = 0;
const slides = document.getElementsByClassName("slide");

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 2500); // 2.5s interval
}

showSlides();
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}
