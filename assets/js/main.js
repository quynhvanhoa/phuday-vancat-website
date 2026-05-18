// Phủ Dầy Vân Cát - Main script
document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu toggle
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            nav.classList.toggle('open');
            const isOpen = nav.classList.contains('open');
            toggle.setAttribute('aria-expanded', isOpen);
            toggle.innerHTML = isOpen ? '&times;' : '&#9776;';
        });
    }

    // Tour 360 stops
    const stops = document.querySelectorAll('.tour-stop');
    const tourLabel = document.getElementById('tour-current-label');
    stops.forEach(stop => {
        stop.addEventListener('click', function() {
            stops.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            if (tourLabel) tourLabel.textContent = this.textContent.trim();
        });
    });

    // Contact form (demo only)
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = form.dataset.thankyou || 'Cảm ơn quý vị đã liên hệ với Phủ Dầy Vân Cát.';
            alert(msg);
            form.reset();
        });
    }

    // Sticky header shadow on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }
});
