// 1. HAMBURGER MENU MOBILE
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenu.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
    } else {
        icon.className = 'fa-solid fa-bars';
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if(navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenu.querySelector('i').className = 'fa-solid fa-bars';
        }
    });
});

// 2. SCROLLED NAVBAR & BACK TO TOP BUTTON
const navbar = document.querySelector('.navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    // Efek Transisi Navbar
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.boxShadow = '0 10px 30px rgba(122, 24, 24, 0.06)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        navbar.style.boxShadow = 'none';
    }

    // Tampilkan/Sembunyikan Tombol Back to Top
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 3. SCROLL REVEAL & NUMBER COUNTER ANIMATION
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-on-scroll');
            
            // Jika elemen adalah counter, jalankan fungsi angka berhitung
            if (entry.target.classList.contains('counter')) {
                runCounter(entry.target);
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .menu-item, .about-text, .about-img').forEach((el) => {
    el.classList.add('hidden-before-scroll');
    revealObserver.observe(el);
});

// Tambahkan observer khusus untuk angka counter
document.querySelectorAll('.counter').forEach(counter => revealObserver.observe(counter));

function runCounter(el) {
    const target = +el.getAttribute('data-target');
    let count = 0;
    const speed = target / 50; 

    const updateCount = () => {
        if (count < target) {
            count += Math.ceil(speed);
            if (count > target) count = target;
            el.innerText = count + (target === 100 ? '%' : '+');
            setTimeout(updateCount, 25);
        }
    };
    updateCount();
}

// 4. ACTIVE LINK TRACKER (Menyala otomatis mengikuti scroll halaman)
const sections = document.querySelectorAll('header, section');
const navItems = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });
});

// 5. TEXT TYPING ANIMATION (Efek Mengetik)
const text = "Authentic Minangkabau Cuisine";
let index = 0;
function typeText() {
    if (index < text.length) {
        document.querySelector('.typing-text').innerHTML += text.charAt(index);
        index++;
        setTimeout(typeText, 100);
    }
}
setTimeout(typeText, 500); // Mulai setelah halaman termuat sedikit

// 6. PARALLAX 3D TILT EFFECT (Gambar bergerak mengikuti pergerakan mouse)
document.querySelectorAll('.project-tilt').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const img = element.querySelector('img');
        if (!img) return;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - (rect.width / 2);
        const y = e.clientY - rect.top - (rect.height / 2);
        
        // Miringkan gambar maksimal 10 derajat
        img.style.transform = `rotateY(${x / (rect.width / 20)}deg) rotateX(${-y / (rect.height / 20)}deg) scale(1.03)`;
    });

    element.addEventListener('mouseleave', (element) => {
        const img = element.currentTarget.querySelector('img');
        if (img) img.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
});

// 7. CUSTOM MOUSE CURSOR TRACKER (Lingkaran Aura Emas)
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Efek membesar saat kursor menyentuh tombol/link interaktif
document.querySelectorAll('a, button, .feature-card, .menu-item').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
    });
    link.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
    });
});
