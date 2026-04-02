// Smooth scroll para navegación

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({

            behavior: 'smooth'

        });

    });

});

// Carrusel interactivo (UX prototipo clicable)
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.carousel-button.prev');
const nextBtn = document.querySelector('.carousel-button.next');
let currentSlide = 0;
let carouselInterval = null;

const updateCarousel = (index) => {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        indicators[i].classList.toggle('active', i === index);
        indicators[i].setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    currentSlide = index;
};

const showNext = () => updateCarousel((currentSlide + 1) % slides.length);
const showPrev = () => updateCarousel((currentSlide - 1 + slides.length) % slides.length);

prevBtn.addEventListener('click', () => { showPrev(); resetAutoSlide(); });
nextBtn.addEventListener('click', () => { showNext(); resetAutoSlide(); });

indicators.forEach((dot) => {
    dot.addEventListener('click', () => {
        updateCarousel(Number(dot.dataset.slide));
        resetAutoSlide();
    });
});

const resetAutoSlide = () => {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(showNext, 5000);
};

// Iniciar carrusel auto
carouselInterval = setInterval(showNext, 5000);