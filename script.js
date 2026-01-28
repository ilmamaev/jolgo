/**
 * jolgo Landing Page - Interactive JavaScript
 * Современная интерактивность и анимации
 */

// ============================================
// DOM Loaded Event
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initParallax();

    console.log('%cjolgo', 'color: #6366F1; font-size: 32px; font-weight: bold;');
    console.log('%c✨ Добро пожаловать!', 'color: #8B5CF6; font-size: 16px;');
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Добавляем класс scrolled при прокрутке
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Highlight active nav link
    highlightActiveSection();
    window.addEventListener('scroll', highlightActiveSection);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Игнорируем якоря без цели
            if (href === '#') {
                return;
            }

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Закрываем мобильное меню если открыто
                closeMobileMenu();
            }
        });
    });
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Анимируем элементы с задержкой
                if (entry.target.hasAttribute('data-delay')) {
                    const delay = entry.target.getAttribute('data-delay');
                    entry.target.style.transitionDelay = delay + 'ms';
                }

                // Отключаем наблюдение после анимации
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .step-item,
        .benefit-card,
        .section-header
    `);

    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in-up');
        element.setAttribute('data-delay', index * 100);
        observer.observe(element);
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

function closeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && toggle.classList.contains('active')) {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// ============================================
// Parallax Effect
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero');

    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (scrolled < window.innerHeight) {
                const orbs = document.querySelectorAll('.gradient-orb');
                orbs.forEach((orb, index) => {
                    const speed = parallaxSpeed * (index + 1);
                    orb.style.transform = `translate(${scrolled * speed * 0.5}px, ${scrolled * speed}px)`;
                });
            }
        });
    }
}

// ============================================
// Number Counter Animation
// ============================================
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }

        // Форматируем число
        const formatted = Math.floor(current).toLocaleString('ru-RU');
        element.textContent = formatted;
    }, 16);
}

// Инициализируем счетчики при скролле
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-number');

            stats.forEach(stat => {
                const text = stat.textContent.trim();
                const hasPlus = text.includes('+');
                const hasPercent = text.includes('%');
                const hasK = text.includes('K') || text.includes('К');

                // Извлекаем число
                const number = parseInt(text.replace(/\D/g, ''));

                if (number) {
                    // Определяем суффикс
                    let suffix = '';
                    if (hasK) suffix = 'К+';
                    else if (hasPlus) suffix = '+';
                    else if (hasPercent) suffix = '%';

                    stat.textContent = '0' + suffix;

                    setTimeout(() => {
                        // Анимируем только число
                        let current = 0;
                        const increment = number / 50;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                current = number;
                                clearInterval(timer);
                            }
                            stat.textContent = Math.floor(current) + suffix;
                        }, 40);
                    }, 300);
                }
            });

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// Button Ripple Effect
// ============================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);
}

// Добавляем эффект ripple ко всем кнопкам
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download, .store-button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Стили для ripple эффекта
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .btn-download, .store-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Card Tilt Effect
// ============================================
function initCardTilt() {
    const cards = document.querySelectorAll('.feature-card, .benefit-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Инициализируем только на десктопе
if (window.innerWidth > 1024) {
    initCardTilt();
}

// ============================================
// Floating Elements Animation
// ============================================
function animateFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-card, .floating-element');

    floatingElements.forEach((element, index) => {
        const delay = index * 0.5;
        element.style.animationDelay = `${delay}s`;
    });
}

animateFloatingElements();

// ============================================
// Progress Bar на Chart
// ============================================
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.chart-bar');

            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.animation = 'barGrow 1s ease-out forwards';
                }, index * 200);
            });

            chartObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const benefitChart = document.querySelector('.benefit-chart');
if (benefitChart) {
    chartObserver.observe(benefitChart);
}

// ============================================
// Easter Egg - Konami Code
// ============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiPattern.length);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎉'.repeat(50);
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        font-size: 3rem;
        pointer-events: none;
        z-index: 99999;
        animation: confettiFall 3s linear;
    `;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);

    console.log('%c🎊 Вы нашли секретный код! +1000 бонусов! 🎊', 'color: #EC4899; font-size: 20px; font-weight: bold;');
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-100%);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ============================================
// Performance Optimization
// ============================================
// Lazy Loading для изображений
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce функция для оптимизации событий
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle функция для scroll событий
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Оптимизируем scroll события
window.addEventListener('scroll', throttle(() => {
    // Обработка scroll событий
}, 100));

// ============================================
// Accessibility Improvements
// ============================================
// Добавляем skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#features';
skipLink.className = 'skip-to-main';
skipLink.textContent = 'Перейти к основному содержанию';
skipLink.style.cssText = `
    position: absolute;
    top: -100px;
    left: 0;
    background: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    z-index: 10000;
    transition: top 0.3s;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-100px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ============================================
// Analytics (Placeholder)
// ============================================
function trackEvent(category, action, label) {
    console.log('📊 Event:', { category, action, label });
    // Здесь можно добавить интеграцию с Google Analytics или другими сервисами
}

// Отслеживаем клики по кнопкам
document.querySelectorAll('.btn-primary, .btn-download, .store-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = e.currentTarget.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    });
});

// ============================================
// Debug Mode
// ============================================
if (window.location.search.includes('debug=true')) {
    console.log('%c🔧 Debug Mode Activated', 'color: #FF6F00; font-size: 16px; font-weight: bold;');

    // Показываем границы всех элементов
    document.querySelectorAll('*').forEach(el => {
        el.style.outline = '1px solid rgba(255, 0, 0, 0.3)';
    });
}

console.log('%c✨ jolgo загружен успешно!', 'color: #6366F1; font-size: 14px;');
