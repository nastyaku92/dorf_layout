document.addEventListener('DOMContentLoaded', () => {

    console.log('scripts public');

        setTimeout(function () {
        const element = document.querySelector('.banner-diler-wrap');
        if (element) {
            element.classList.add('show');
        }
    }, 1000);


    let winWidth = document.body.clientWidth;

    const options = { searchable: false, placeholder: 'Выберите вариант', searchtext: 'Поиск...', selectedtext: 'выбрано' };
    document.querySelectorAll('select').forEach(function (selectElement) {

        if (selectElement.id === 'seachable-select') { // catalog    
            selectElement.addEventListener('change', function () {
                console.log('Selected value:', this.value);
                window.location.href = this.value;
            });
        } else {
            options.placeholder = 'Выберите регион из списка';            
        }


        NiceSelect.bind(selectElement, options);
    });

    // Маска для телефона
    const telInputs = document.querySelectorAll("input[type='tel']");
    if (telInputs.length > 0 && typeof Inputmask !== 'undefined') {
        Inputmask("+7 (999) 999 - 99 - 99").mask(telInputs);
    }

    // Добавление скрытого поля
    const ajaxForms = document.querySelectorAll(".ajax_form");
    ajaxForms.forEach(form => {
        const hiddenDiv = document.createElement('div');
        hiddenDiv.className = 'd-none';
        hiddenDiv.innerHTML = '<input type="text" name="org" value="" class="_org" style="visibility:hidden; height: 0; width: 0; padding: 0; border:none;"/>';
        form.appendChild(hiddenDiv);
    });

    // Offcanvas боковая панель (ниже header)
    const offcanvas = document.getElementById('offcanvasMenu');
    // Затемнение фона (backdrop)
    let backdrop = document.getElementById('offcanvasBackdrop');

    // Создаём backdrop динамически, если его нет
    if (!backdrop && offcanvas) {
        backdrop = document.createElement('div');
        backdrop.id = 'offcanvasBackdrop';
        backdrop.className = 'offcanvas-backdrop-below';
        offcanvas.parentNode.insertBefore(backdrop, offcanvas);
    }


    // Функция для получения ширины скроллбара
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    // Функция для проверки наличия скролла на странице
    function hasScrollbar() {
        return document.documentElement.scrollHeight > window.innerHeight;
    }

    // Сохраняем оригинальную ширину скроллбара
    let scrollbarWidth = 0;

    // Функция для блокировки скролла
    function lockScroll() {
        if (hasScrollbar()) {
            scrollbarWidth = getScrollbarWidth();
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        }
    }

    // Функция для разблокировки скролла
    function unlockScroll() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    // Отслеживаем открытие модального окна Bootstrap 5
    /* document.addEventListener('show.bs.modal', function () {
        lockScroll();
    });
 */
    // Отслеживаем закрытие модального окна Bootstrap 5
    document.addEventListener('hidden.bs.modal', function () {
        console.log('unlock');

        unlockScroll();
    });



    // Находим все кнопки меню (и мобильную, и десктопную)
    const menuToggles = document.querySelectorAll('.nav_burger');
    const navIcons = document.querySelectorAll('.nav-icon1');
    const closeLeft = document.querySelector('.btn-close-left');

    // Инициализация slinky
    let slinkyInitialized = false;
    const slinkyMenu = document.querySelector('.slinky-menu');

    // Функция открытия offcanvas
    function openOffcanvas() {
        offcanvas.classList.toggle('show');
        backdrop.classList.toggle('show');

        if (offcanvas.classList.contains('show')) {
            //console.log('Класс show есть');
            // Блокируем скролл страницы и добавляем отступ
            /* document.body.style.overflow = 'hidden';
            if (winWidth > 991) {
                document.body.style.paddingRight = '15px';
            } */
            lockScroll();
        } else {
            //console.log('Класса show нет');
            /* document.body.style.overflow = '';
            document.body.style.paddingRight = ''; */
            unlockScroll();
        }

        // Открываем все иконки бургера
        navIcons.forEach(icon => icon.classList.toggle('open'));

        // Инициализируем slinky при первом открытии
        if (!slinkyInitialized && slinkyMenu) {

            if (typeof slinkyMenu.slinky === 'function') {
                /*  slinkyMenu.slinky({
                     title: true,
                     resize: true
                 }); */

                new SlinkyVanilla(slinkyMenu, {
                    title: true,
                    resize: true
                });
            }
            slinkyInitialized = true;
        }
    }

    // Функция закрытия offcanvas
    function closeOffcanvas() {
        offcanvas.classList.remove('show');
        backdrop.classList.remove('show');

        unlockScroll();

        // Закрываем все иконки бургера
        navIcons.forEach(icon => icon.classList.remove('open'));
    }

    // Навешиваем обработчики на все кнопки меню
    menuToggles.forEach(toggle => {
        toggle.addEventListener('click', openOffcanvas);
    });

    // Закрытие по клику на backdrop
    if (backdrop) {
        backdrop.addEventListener('click', closeOffcanvas);
    }

    if (closeLeft) {
        closeLeft.addEventListener('click', closeOffcanvas);
    }

    // Закрытие по клавише Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && offcanvas && offcanvas.classList.contains('show')) {
            closeOffcanvas();
        }
    });

    // Находим все dropdown элементы
    const dropdownItems = document.querySelectorAll('.fixed-header .nav-item.dropdown');

    dropdownItems.forEach(function (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Пропускаем, если нет toggle или меню
        if (!toggle || !menu) return;

        // Создаем экземпляр дропдауна Bootstrap
        const bsDropdown = new bootstrap.Dropdown(toggle);

        let showTimer;
        let hideTimer;

        // Функция показа дропдауна
        function showDropdown() {
            clearTimeout(hideTimer);
            clearTimeout(showTimer);
            showTimer = setTimeout(() => {
                bsDropdown.show();
            }, 100);
        }

        // Функция скрытия дропдауна
        function hideDropdown() {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                bsDropdown.hide();
            }, 200);
        }

        // Обработчики для toggle (ссылки)
        toggle.addEventListener('mouseenter', showDropdown);
        toggle.addEventListener('mouseleave', hideDropdown);

        // Обработчики для меню
        menu.addEventListener('mouseenter', showDropdown);
        menu.addEventListener('mouseleave', hideDropdown);

        // Делаем ссылку кликабельной (только если href не равен "#")
        toggle.addEventListener('click', function (e) {
            if (this.href && !this.href.endsWith('#')) {
                window.location.href = this.href;
            }
        });
    });

    /*     setTimeout(function () {
            AOS.init({
                once: true,
                duration: 800,
                easing: "ease-out-cubic",
                delay: 0,
                offset: 120,
                //disable: 'mobile'
            });
    
        }, 100) // fix */


    // Инициализация Fancybox
    if (typeof Fancybox !== 'undefined') {
        const fancyboxElements = document.querySelectorAll("[data-fancybox]");
        if (fancyboxElements.length > 0) {
            Fancybox.bind("[data-fancybox]", {
                // Your custom options
                animated: false,
                placeFocusBack: false,
                // // autoFocus: false,
                Images: {
                    zoom: false,
                },
                //showClass: "f-fadeIn",
                //hideClass: "f-fadeOut",
            });
        }
    }

    // Create an example popover
    document.querySelectorAll('[data-bs-toggle="popover"]')
        .forEach(popover => {
            new bootstrap.Popover(popover)
        })

    // Create an example popover
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(tooltip => {
            new bootstrap.Tooltip(tooltip)
        })

    const swiperGallery = new Swiper('.swiper-gallery', {
        modules: [SwiperNavigation, SwiperPagination, SwiperAutoplay, SwiperEffectFade],
        effect: 'fade',
        pagination: {
            el: '.swiper-gallery .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-gallery .swiper-button-next',
            prevEl: '.swiper-gallery .swiper-button-prev',
        },

        autoplay: {
            delay: 5000,
        },
    });

    new Swiper('.swiper-gallery-videos', {
        modules: [SwiperNavigation, SwiperPagination, SwiperAutoplay, SwiperEffectFade],
        effect: 'fade',
        pagination: {
            el: '.swiper-gallery-videos .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.bl-videos + .container .videos-arrows .swiper-button-next',
            prevEl: '.bl-videos + .container .videos-arrows .swiper-button-prev',
        },
        /* 
                autoplay: {
                    delay: 5000,
                }, */
    });

    if (document.querySelector('.swiper-pagination-banner')) {
        const swiperAbout = new Swiper('.swiper-about', {
            modules: [SwiperNavigation, SwiperPagination, SwiperAutoplay, SwiperEffectFade],
            effect: 'fade',
            pagination: {
                el: '.swiper-pagination-banner',
                clickable: true,
                bulletClass: 'pagination-bullet-banner',
                bulletActiveClass: 'active',
                renderBullet: function (index, className) {
                    const num = index + 1;
                    const formattedNum = num < 10 ? `0${num}` : `${num}`;
                    return `<div class="pagination-bullet ${className}" data-slide="${num}">
                        <span class="line"></span>
                        <span>${formattedNum}</span>
                    </div>`;
                }
                /* type: 'custom',
                renderCustom: function (swiper, current, total) {
                    console.log('ssssss');
                    
                    let html = '';
                    for (let i = 1; i <= total; i++) {
                        const formattedNum = i < 10 ? `0${i}` : `${i}`;
                        const activeClass = i === current ? 'active' : '';
                         html += `<div class="pagination-bullet pagination-bullet-banner ${activeClass}" data-slide="${i}"><span class="line"></span><span>${formattedNum}</span></div>`;
                    }
                    return html;
                } */
            },
        });

        /* document.querySelector('.swiper-pagination-banner').addEventListener('click', (e) => {
            const bullet = e.target.closest('.pagination-bullet');
            if (bullet && bullet.dataset.slide) {
                const slideIndex = parseInt(bullet.dataset.slide) - 1;
                swiperAbout.slideTo(slideIndex);
            }
        }); */
    }

    if (document.querySelector('.swiperFreeMode')) {
        const swiperFreeMode = new Swiper(".swiperFreeMode", {
            slidesPerView: 'auto', // Произвольная ширина
            spaceBetween: '10px',      // Расстояние между слайдами
            freeMode: true,        // Свободный скролл
            grabCursor: true,      // Курсор-рука
            mousewheel: true,      // Скролл колесиком мыши
        });
        setTimeout(function () {
            swiperFreeMode.update();

        }, 100);
    }


    const modalFormFeed = document.getElementById('modal_form-feed')
    if (modalFormFeed) {
        modalFormFeed.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const recipient = button.getAttribute('data-whatever')

            // Update the modal's content.
            const modalTitle = modalFormFeed.querySelector('.modal-title')

            modalTitle.textContent = `${recipient}`
        })
    }

/*     const showAllButton = document.querySelector('.js-show-all');
    if (showAllButton) {
        showAllButton.addEventListener('click', function () {
            const hiddenItems = document.querySelectorAll('.accordion-item.d-none');

            if (hiddenItems.length > 0) {
                hiddenItems.forEach(function (item) {
                    item.classList.remove('d-none');
                });
                // Скрыть кнопку после показа
                this.style.display = 'none';
            }
        });
    } */

    const modalMap = document.getElementById('modalTests')
    const mapAjax = document.getElementById('mapAjax')
    if (modalMap) {
        modalMap.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const id = button.getAttribute('data-id')

            const videoUrl = '//videos/ocean.mp4'

            // Очищаем предыдущее содержимое
            mapAjax.innerHTML = ''


            // Создаем элементы
            const titleDiv = document.createElement('div')
            titleDiv.className = 'modal-title fs-2 mb-3'
            titleDiv.textContent = 'Ростов'

            const mapTextDiv = document.createElement('div')
            mapTextDiv.className = 'map-text ffu'
            mapTextDiv.innerHTML = '<div class="opacity-50">Дата испытания</div><div class="">10.09.2024</div>'

            const iframe = document.createElement('iframe')
            iframe.setAttribute('frameborder', '0')
            iframe.setAttribute('scrolling', 'no')
            iframe.setAttribute('allowfullscreen', '')
            iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; accelerometer; gyroscope; picture-in-picture; clipboard-write; web-share; screen-wake-lock')
            iframe.src = videoUrl + '?autoplay=1&mute=true'

            // Добавляем все в mapAjax
            mapAjax.appendChild(titleDiv)
            mapAjax.appendChild(mapTextDiv)
            mapAjax.appendChild(iframe)

            // При необходимости можно использовать id для получения разных данных
            console.log('ID испытания:', id)


            // Здесь можно получить данные через AJAX/Fetch по id
            // Пример с fetch:
            /* fetch(`/api/tests/${id}`)
                .then(response => response.json())
                .then(data => {
                    // Создаем элементы с полученными данными
                    const titleDiv = document.createElement('div')
                    titleDiv.className = 'modal-title fs-2 mb-3'
                    titleDiv.textContent = data.city || 'Ростов'

                    const mapTextDiv = document.createElement('div')
                    mapTextDiv.className = 'map-text ffu'
                    mapTextDiv.innerHTML = `<div class="opacity-50">Дата испытания</div><div class="">${data.date || '10.09.2024'}</div>`

                    if (data.videoUrl) {
                        const iframe = document.createElement('iframe')
                        iframe.setAttribute('frameborder', '0')
                        iframe.setAttribute('scrolling', 'no')
                        iframe.setAttribute('allowfullscreen', '')
                        iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; accelerometer; gyroscope; picture-in-picture; clipboard-write; web-share; screen-wake-lock')
                        iframe.src = data.videoUrl || '//videos/ocean.mp4?autoplay=1&mute=true'
                    }


                    mapAjax.appendChild(titleDiv)
                    mapAjax.appendChild(mapTextDiv)
                    if (data.videoUrl) {
                        mapAjax.appendChild(iframe)
                    }

                })
                .catch(error => {
                    console.error('Ошибка загрузки данных:', error)
                }) */

        })

        modalMap.addEventListener('hidden.bs.modal', event => {
            mapAjax.innerHTML = ''
        })
    }

    document.querySelectorAll('.js-video-click').forEach(el => {
        el.addEventListener('click', () => {
            if (el.querySelector('video')) return;

            const src = el.dataset.src || '/videos/ocean.mp4';

            el.classList.add('video-loaded')

            const video = document.createElement('video');
            video.className = 'video-js vjs-default-skin vjs-big-play-centered rounded-3';
            video.setAttribute('controls', '');
            video.setAttribute('preload', 'auto');
            video.setAttribute('data-setup', '{}');
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.position = 'absolute';
            video.style.padding = '0';

            // Добавляем source
            const source = document.createElement('source');
            source.src = src;
            source.type = 'video/mp4';
            video.appendChild(source);

            el.querySelector('img')?.remove();
            el.appendChild(video);

            // Инициализируем Video.js плеер
            const player = videojs(video, {
                autoplay: true,
                muted: true,
                controls: true,
                loop: false,
                fluid: true,
                playbackRates: [0.5, 1, 1.5, 2],
                controlBar: {
                    volumePanel: {
                        inline: false
                    },
                    pictureInPictureToggle: true,
                    remainingTimeDisplay: true
                },
                userActions: {
                    doubleClick: true,
                    hotkeys: true
                }
            });

            // Запускаем воспроизведение
            player.play().catch(e => console.log('Autoplay prevented:', e));
        });
    });

    if (document.querySelector('.swiperRevies')) {
        new Swiper('.swiperRevies', {
            modules: [SwiperNavigation, SwiperPagination, SwiperAutoplay],
            slidesPerView: 1.2,
            spaceBetween: 10,
            pagination: {
                el: '.swiperRevies .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiperRevies-relative .swiper-button-next',
                prevEl: '.swiperRevies-relative .swiper-button-prev',
            },
            breakpoints: {
                576: {
                    slidesPerView: 1.5,
                },
                991: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            },
            /*  autoplay: {
                 delay: 5000,
                 disableOnInteraction: false,
             }, */
        });
    }



    if (winWidth > 991) {

        // Использование
        /*  new StickyLayout({
             header: 'header',
             footer: 'footer',
             block: '.bl-gradient'
         });
  */

    }

});


class StickyLayout {
    constructor(options = {}) {
        this.header = options.header || 'header';
        this.footer = options.footer || 'footer';
        this.block = options.block || '.my-block';
        this.init();
    }

    calculateHeight() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Получаем элементы
        const headerEl = document.querySelector(this.header);
        const footerEl = document.querySelector(this.footer);
        const blockEl = document.querySelector(this.block);

        if (!blockEl) return;

        // Получаем общую высоту header
        let headerFullHeight = headerEl ? headerEl.offsetHeight : 0;

        // Header фиксирован сверху, поэтому при скролле он всегда полностью виден
        // Ничего не вычитаем из его высоты
        let visibleHeaderHeight = headerFullHeight;

        // Получаем позицию footer относительно окна
        let footerHeight = 0;
        let subtractFooter = 0;

        if (footerEl) {
            footerHeight = footerEl.offsetHeight;
            const footerRect = footerEl.getBoundingClientRect();

            // Если footer достиг нижней части экрана или вышел за пределы
            if (footerRect.top < windowHeight) {
                // Footer виден полностью или частично
                if (footerRect.top > 0) {
                    // Footer частично виден
                    subtractFooter = Math.min(footerHeight, windowHeight - footerRect.top);
                } else {
                    // Footer вышел за пределы экрана
                    subtractFooter = Math.min(footerHeight, windowHeight + footerRect.bottom);
                }
            }
        }

        // Рассчитываем доступную высоту для блока
        // Вычитаем: высота окна - видимая часть header - видимая часть footer
        let availableHeight = windowHeight - visibleHeaderHeight - subtractFooter;

        // Блок не может быть меньше 0
        availableHeight = Math.max(availableHeight, 0);

        if (subtractFooter > 0) {
            availableHeight -= 44;
        }

        // Применяем высоту
        blockEl.style.height = `${availableHeight}px`;
        blockEl.style.overflowY = 'auto';

        // Для отладки (опционально)
        console.log({
            windowHeight,
            scrollY,
            headerFullHeight,
            //visibleHeaderHeight,
            subtractFooter,
            availableHeight
        });
    }

    init() {
        this.calculateHeight();

        let timeout;
        let ticking = false;

        const update = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.calculateHeight();
                    ticking = false;
                });
                ticking = true;
            }

            // Сбрасываем transition после окончания скролла
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const blockEl = document.querySelector(this.block);
                if (blockEl) {
                    blockEl.style.transition = '';
                }
            }, 200);
        };

        window.addEventListener('scroll', update);
        window.addEventListener('resize', update);
    }
}

// var myModal = document.getElementById('exampleModal')
// var myInput = document.getElementById('myInput')
//
// myModal.addEventListener('shown.bs.modal', function () {
//     myInput.focus()
// })

// Функция для отправки данных формы
function submitForm(form, formData, config) {

    /*test result*/
    console.log('FormData содержимое:');
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(`  ${key}: Файл "${value.name}" (${value.type})`);
        } else {
            console.log(`  ${key}: "${value}"`);
        }
    });


    if (config.redirect) {
        window.location.href = config.redirect;
    } else {

        // Закрываем модальное окно формы
        const modalForm = document.getElementById(config.modalFormId);
        if (modalForm) {
            const bootstrapModal = bootstrap.Modal.getInstance(modalForm);
            if (bootstrapModal) {
                bootstrapModal.hide();
            } else {
                modalForm.style.display = 'none';
            }
        }

        // Открываем модальное окно результата
        const modalResult = document.getElementById(config.modalResultId);
        if (modalResult) {
            const resultModal = new bootstrap.Modal(modalResult);
            resultModal.show();
        }

    }

    return false;

    //fetch(config.ajaxUrl, {
    fetch('/local/templates/name/ajax/feedback.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'ok') {
                // Закрываем модальное окно формы
                const modalForm = document.getElementById(config.modalFormId);
                if (modalForm) {
                    const bootstrapModal = bootstrap.Modal.getInstance(modalForm);
                    if (bootstrapModal) {
                        bootstrapModal.hide();
                    } else {
                        modalForm.style.display = 'none';
                    }
                }

                // Открываем модальное окно результата
                const modalResult = document.getElementById(config.modalResultId);
                if (modalResult) {
                    const resultModal = new bootstrap.Modal(modalResult);
                    resultModal.show();

                    // Опционально: меняем текст сообщения в модальном окне
                    /*  const messageElement = modalResult.querySelector('.modal-body p');
                     if (messageElement && config.successMessage) {
                         messageElement.textContent = config.successMessage;
                     } */
                }

                // Очищаем форму
                /* form.reset();

                // Восстанавливаем значения по умолчанию
                if (config.hasAgreement) {
                    const agreementCheckbox = form.querySelector('[name="agreement"]');
                    if (agreementCheckbox) {
                        agreementCheckbox.checked = true;
                    }
                }

                const sMessageField = form.querySelector('.s-message');
                if (sMessageField) {
                    sMessageField.value = '';
                } */
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке формы:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        });
}

// Функция для настройки валидации формы
function setupFormValidation(form, config) {
    const validation = new JustValidate(form, {
        errorFieldCssClass: 'custom-error',
        successFieldCssClass: 'custom-valid',
        errorLabelCssClass: ['custom-error-label', 'custom-error'],
        errorLabelStyle: {
            backgroundColor: ''
        },
        focusInvalidField: true,
        lockForm: true,
    });

    // Валидация имени
    const nameField = form.querySelector('[name="name"]');
    if (nameField) {
        validation.addField(nameField, [
            {
                rule: 'required',
                errorMessage: 'Пожалуйста, введите ваше имя'
            },
            {
                rule: 'minLength',
                value: 2,
                errorMessage: 'Имя должно содержать не менее 2 символов'
            }
        ]);
    }

    // Валидация телефона
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField) {
        validation.addField(phoneField, [
            {
                rule: 'required',
                errorMessage: 'Пожалуйста, введите номер телефона'
            },
            /*  {
                 rule: 'customRegexp',
                 value: /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/,
                 errorMessage: 'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX'
             } */
        ]);
    }

    // Валидация email (если есть)
    if (config.hasEmail) {
        const emailField = form.querySelector('[name="email"]');
        if (emailField) {
            validation.addField(emailField, [
                {
                    rule: 'required',
                    errorMessage: 'Пожалуйста, введите email'
                },
                {
                    rule: 'email',
                    errorMessage: 'Введите корректный email адрес'
                }
            ]);
        }
    }

    // Валидация hasSelect (если есть)
    if (config.hasSelect) {
        console.log('sdfsdfsdfsdf');

        const selectField = form.querySelector('[name="select_region"]');
        if (selectField) {
            // Добавляем кастомный валидатор для NiceSelect2
            validation.addField(selectField, [
                {
                    rule: 'required',
                    errorMessage: 'Пожалуйста, выберите регион'
                },
                {
                    // Кастомный валидатор для проверки, что выбран не пустой вариант
                    validator: (value) => {
                        // Проверяем, что значение не пустое и не равно дефолтному
                        return value && value !== '' && value !== 'Выберите регион из списка';
                    },
                    errorMessage: 'Пожалуйста, выберите регион'
                }
            ]);

            // Добавляем обработчик изменений для NiceSelect2
            // Принудительно запускаем валидацию при изменении селекта
            /*             $(selectField).on('change', function () {
                            // Запускаем валидацию этого поля
                            if (validation && validation.validateField) {
                                validation.validateField(selectField);
                            } else {
                                // Альтернативный способ - перезапускаем валидацию всей формы
                                validation.revalidate();
                            }
                        }); */
        }
    }

    // Валидация соглашения (если есть)
    if (config.hasAgreement) {
        const agreementField = form.querySelector('[name="agreement"]');
        if (agreementField) {
            validation.addField(agreementField, [
                {
                    rule: 'required',
                    errorMessage: 'Необходимо согласие с политикой конфиденциальности'
                }
            ]);
        }
    }

    validation.onSuccess((event) => {
        event.preventDefault();

        // Собираем данные формы
        const formData = new FormData(form);

        // Добавляем кастомные данные из конфигурации
        Object.keys(config.customData).forEach(key => {
            formData.append(key, config.customData[key]);
        });

        // Добавляем текущую страницу
        formData.append('page', window.location.href);

        // Отправляем форму
        submitForm(form, formData, config);
    });


    // остановим анимацию Trig.js после проигрывания
    const elements = document.querySelectorAll(".animate-once");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // даём анимации отработать
                setTimeout(() => {
                    if (el.classList.contains('trig') && !el.classList.contains('animation-played')) {
                        el.classList.add('animation-played');
                    }

                    el.classList.remove("enable-trig"); // отключаем повтор
                    obs.unobserve(el); // перестаём следить
                }, 1000); // подстрой под длительность анимации
            }
        });
    }, { threshold: 0.3 });

    elements.forEach(el => observer.observe(el));
};

// Делаем функции глобальными
window.submitForm = submitForm;
window.setupFormValidation = setupFormValidation;