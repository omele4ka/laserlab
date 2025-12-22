document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       1. МОБИЛЬНОЕ МЕНЮ (исправлено)
    ===================================================== */
    const burgerBtn = document.querySelector('.burger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__list a');

    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    };

    const openMobileMenu = () => {
        mobileMenu.classList.add('active');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    };

    const toggleMenu = () => {
        mobileMenu.classList.contains('active')
            ? closeMobileMenu()
            : openMobileMenu();
    };

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    }

    /* Закрываем меню при повороте экрана (устраняет баги landscape) */
    window.addEventListener('orientationchange', closeMobileMenu);


    /* =====================================================
       2. СЛАЙДЕР (с поддержкой swipe) — БЕЗ ИЗМЕНЕНИЙ
    ===================================================== */
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn--prev');
    const nextBtn = document.querySelector('.slider-btn--next');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        const updateSlider = () => {
            const width = slides[0].clientWidth;
            track.style.transform = `translateX(-${currentIndex * width}px)`;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) nextSlide();
            if (touchEndX - touchStartX > 50) prevSlide();
        });

        window.addEventListener('resize', updateSlider);
    }


    /* =====================================================
       3. МОДАЛЬНОЕ ОКНО (обратная связь)
    ===================================================== */
    const modal = document.getElementById('contact-modal');
    const openBtns = document.querySelectorAll('.js-open-modal');
    const closeBtns = document.querySelectorAll('.js-close-modal, .modal__close-btn');

    const openModal = () => {
        if (!modal) return;
        modal.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;

        modal.classList.remove('is-visible');

        const detailOverlay = document.getElementById('product-detail');
        const isDetailOpen =
            detailOverlay &&
            (detailOverlay.classList.contains('active') ||
             detailOverlay.style.display === 'block');

        if (!isDetailOpen) {
            document.body.style.overflow = '';
        }
    };

    openBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    }


    /* =====================================================
       4. ДЕТАЛИ ТОВАРА (overlay)
    ===================================================== */
// 1. Используем querySelectorAll, чтобы найти ВСЕ кнопки с этим классом
    const detailOverlay = document.getElementById('product-detail');
    const closeDetailBtns = document.querySelectorAll('.js-close-detail'); // Находим все кнопки закрытия

    const detailImg = document.getElementById('detail-img');
    const detailTitle = document.getElementById('detail-title');
    const detailText = document.getElementById('detail-full-text');

// Обработка открытия (уже была верной, оставляем)
    document.querySelectorAll('.btn-more').forEach(button => {
        button.addEventListener('click', e => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            const img = card.querySelector('img');
            const title = card.querySelector('h4');
            const fullDesc = card.querySelector('.full-description');

            if (detailImg && img) detailImg.src = img.src;
            if (detailTitle && title) detailTitle.innerText = title.innerText;
            if (detailText && fullDesc) detailText.innerHTML = fullDesc.innerHTML;

            if (detailOverlay) {
                detailOverlay.style.display = 'block';
                detailOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeDetailBtns.length > 0 && detailOverlay) {
        closeDetailBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                detailOverlay.style.display = 'none';
                detailOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* =====================================================
       5. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
    ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (
                href === '#' ||
                this.classList.contains('js-open-modal') ||
                this.id === 'close-detail'
            ) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            closeMobileMenu(); // важно: закрываем меню перед скроллом
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

});
