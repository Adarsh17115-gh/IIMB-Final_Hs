document.addEventListener('DOMContentLoaded', function () {

    // Smooth Scrolling for Nav Links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const header = document.getElementById('header');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const offset = header?.offsetHeight || 0;

            if (targetElement) {
                const targetPosition = targetElement.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            document.querySelector('.nav-links')?.classList.remove('active');
            document.querySelector('.menu-toggle')?.classList.remove('active');
        });
    });

    // Sticky Navbar & Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = header?.offsetHeight || 0;

    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;

        if (scrollPosition > navbarHeight / 2) {
            header?.classList.add('sticky');
        } else {
            header?.classList.remove('sticky');
        }

        // Highlight active nav link
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 20;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
                correspondingLink?.classList.add('active');
            }
        });

        // Top of page special case
        if (scrollPosition < (sections[0]?.offsetTop || 0) - navbarHeight - 20) {
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-links a[href="#home"]')?.classList.add('active');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');

    menuToggle?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Testimonial Carousel
    let slideIndex = 1;
    const slides = document.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (totalSlides === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        slides[(index - 1 + totalSlides) % totalSlides].classList.add('active');
    }

    window.changeSlide = function (n) {
        slideIndex += n;
        if (slideIndex > totalSlides) slideIndex = 1;
        if (slideIndex < 1) slideIndex = totalSlides;
        showSlide(slideIndex);
    }

    if (slides.length > 0) {
        showSlide(slideIndex);
        // Auto rotation optional
        // setInterval(() => changeSlide(1), 5000);
    }

    // Gallery Modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const spanClose = document.querySelector(".close-modal");

    window.openModal = function (imgSrc) {
        if (!modal || !modalImg) return;
        modal.style.display = "block";
        modalImg.src = imgSrc;
        // Optional caption logic
        // captionText.innerHTML = altText;
    }

    window.closeModal = function () {
        if (modal) modal.style.display = "none";
    }

    modal?.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && modal?.style.display === "block") {
            closeModal();
        }
    });

    // Contact Form Handling (Web3Forms)
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    form?.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !subject || !message) {
            formStatus.textContent = 'Please fill in all fields.';
            formStatus.style.color = 'red';
            return;
        }

        if (!validateEmail(email)) {
            formStatus.textContent = 'Please enter a valid email address.';
            formStatus.style.color = 'red';
            return;
        }

        const botCheck = document.getElementById('botcheck')?.checked;
        if (botCheck) {
            formStatus.textContent = 'Bot submission detected.';
            formStatus.style.color = 'red';
            return;
        }

        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });

        formStatus.textContent = 'Sending...';
        formStatus.style.color = 'var(--text-color-dark)';

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(object)
            });

            const json = await response.json();
            if (response.ok) {
                formStatus.textContent = json.message || "Form submitted successfully!";
                formStatus.style.color = 'green';
                form.reset();
            } else {
                console.error(json);
                formStatus.textContent = json.message || "Something went wrong!";
                formStatus.style.color = 'red';
            }
        } catch (error) {
            console.error(error);
            formStatus.textContent = "Something went wrong!";
            formStatus.style.color = 'red';
        } finally {
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Footer Year Update
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});
