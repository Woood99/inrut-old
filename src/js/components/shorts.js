import Swiper, {
    Navigation,
    Pagination,
    Mousewheel,
    Keyboard
} from 'swiper';
import modal from '../modules/modal';
Swiper.use([Navigation, Pagination, Mousewheel, Keyboard]);
const shorts = () => {
    const shortItems = document.querySelector('.shorts-items');
    if (!shortItems) return;
    const cards = shortItems.querySelectorAll('.card-short');
    if (cards.length === 0) return;
    cardsSetIndex(cards);
    shortItems.addEventListener('click', (e) => {
        const target = e.target;
        const currentCard = target.closest('.card-short');
        if (currentCard) {
            generatePopup(currentCard);
        }
    })

    function cardsSetIndex(cards) {
        cards.forEach((card, index) => {
            card.setAttribute('data-short-card-index', index);
        });
    };

    function generatePopup(currentCard) {
        const currentIndex = currentCard.dataset.shortCardIndex;
        const modalHTML = `
        <div class="shorts-modal">
            <div class="shorts-modal__container">
                <button class="btn-reset shorts-modal__close" aria-label="Закрыть модальное окно">
                    <svg>
                        <use xlink:href="./img/sprite.svg#x"></use>
                    </svg>
                    <span>Закрыть</span>
                </button>
                <div class="shorts-modal__content">
                </div>
            </div>
        </div>
        `;
        modal(modalHTML, '.shorts-modal', 300);
        const modalContainer = document.querySelector('.shorts-modal');
        modalContainer.querySelector('.shorts-modal__content').innerHTML = generateSliderHTML(cards);
        createSlider(modalContainer, currentIndex);
        controlVideo(modalContainer);
    }

    function generateSliderHTML(cards) {
        let htmlSlides = '';
        cards.forEach(card => {
            htmlSlides += `
                <div class="swiper-slide _pause" data-swipe-index="${card.dataset.shortCardIndex}">
                    <div class="skeleton" style="height:calc(100% + 4px);position:absolute;top:-4px;left:0;right:0; ;border-radius:12px;">
                        <span class="web-skeleton" style="width:100%;border-radius:12px;height: 100%;">
                            <span class="web-skeleton__children"></span>
                        </span>
                    </div>
                    <div class="shorts__item-panel"></div>
                    <video class="shorts__item short video-js vjs-default-skin vjs-fluid" data-short-index="${card.dataset.shortCardIndex}" controls
                        data-setup='{ "techOrder": ["youtube"], "sources": [{ "type": "video/youtube", "src": "${card.dataset.shortCardUrl}&enablejsapi=1"}] }'>
                    </video>
                </div>
            `;
        })
        const htmlSlider = `
        <div class="shorts">
            <div class="shorts__wrapper">
                <div class="shorts__list swiper">
                    <div class="swiper-wrapper">
                        ${htmlSlides}
                    </div>
                </div>
                <button type="button" class="btn btn-reset shorts__nav shorts__prev _disabled" title="Предыдущее видео">
                    <svg>
                        <use xlink:href="./img/sprite.svg#check"></use>
                    </svg>
                </button>
                <button type="button" class="btn btn-reset shorts__nav shorts__next _disabled" title="Следующие видео">
                    <svg>
                        <use xlink:href="./img/sprite.svg#check"></use>
                    </svg>
                </button>
            </div>
        </div>
        `;
        return htmlSlider;
    }

    function controlVideo(modalContainer) {
        const slides = modalContainer.querySelectorAll('.swiper-slide');
        if (slides.length === 0) return;
        slides.forEach(slide => {
            const video = slide.querySelector('.shorts__item');
            const panel = slide.querySelector('.shorts__item-panel');
            panel.addEventListener('click', () => {
                if (slide.classList.contains('_pause')) {
                    videojs(video).play();
                    slide.classList.remove('_pause');
                    slide.classList.add('_play');
                } else {
                    videojs(video).pause();
                    slide.classList.remove('_play');
                    slide.classList.add('_pause');
                }
            })
        })
    }

    function createSlider(modalContainer, currentIndex) {
        const sliderEl = modalContainer.querySelector('.shorts__list');

        const slider = new Swiper(sliderEl, {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 16,
            speed: 800,

            direction: 'vertical',
            keyboard: true,
            forceToAxis: true,
            grabCursor: true,
            initialSlide: currentIndex,
            navigation: {
                prevEl: modalContainer.querySelector('.shorts__prev'),
                nextEl: modalContainer.querySelector('.shorts__next'),
            },
            breakpoints: {
                1212: {
                    slidesPerView: 1.1,
                     allowTouchMove: false,
                },
            },
        });
        setTimeout(() => {
            const currentSlide = slider.slides[currentIndex];
            const currentVideo = currentSlide.querySelector('.shorts__item');
            currentSlide.classList.add('_pause');
            const prev = modalContainer.querySelector('.shorts__prev');
            const next = modalContainer.querySelector('.shorts__next');
            [prev, next].forEach(btn => btn.classList.add('_disabled'));
            currentSlide.classList.add('_init');
            videoPlay(currentVideo, 1500);
            slider.on('slideChange', function () {
                const video = slider.slides[slider.realIndex].querySelector('.shorts__item');
                [prev, next].forEach(btn => btn.classList.add('_disabled'));
                getCurrentSlideFromVideo(video).classList.add('_init');
                videoPlay(video, 0);
            });
            if (window.innerWidth > 1212) {
                setTimeout(() => {
                    containerWheel(modalContainer, slider);
                }, 500);
            }
        }, 1300);
    }

    function removeSkeleton(currentVideo) {
        const currentSlide = getCurrentSlideFromVideo(currentVideo);
        const skeleton = currentSlide.querySelector('.skeleton');
        if (skeleton) skeleton.remove();
    }

    function containerWheel(modalContainer, slider) {
        let scrolling = true;
        modalContainer.addEventListener('mousewheel', (e) => {
            const y = e.wheelDelta;
            const next = modalContainer.querySelector('.shorts__next').hasAttribute('disabled');
            const prev = modalContainer.querySelector('.shorts__prev').hasAttribute('disabled');
            if (scrolling) {
                scrolling = false;
                if (y > 0 && !prev) {
                    e.preventDefault();
                    if (getCurrentSlideFromVideo(getCurrentVideo(slider)).classList.contains('_init')) {
                        videojs(getCurrentVideo(slider)).pause();
                    }
                    slider.slidePrev();
                }
                if (y <= 0 && !next) {
                    e.preventDefault();
                    if (getCurrentSlideFromVideo(getCurrentVideo(slider)).classList.contains('_init')) {
                        videojs(getCurrentVideo(slider)).pause();
                    }
                    slider.slideNext();
                }
                setTimeout(() => {
                    scrolling = true;
                }, 1000);
            }
        })
    }

    function videoPlay(currentVideo, delay) {
        if (delay === 0) videosPause();
        let interval = setInterval(() => {
            if (videojs(currentVideo).isReady_) {
                clearInterval(interval);
                setTimeout(() => {
                    if (delay === 0) videosPause();
                    const currentSlide = getCurrentSlideFromVideo(currentVideo);
                    if (!currentSlide.classList.contains('_play') && currentSlide.classList.contains('_init')) {
                        videojs(currentVideo).currentTime(0);
                        videojs(currentVideo).play();
                        currentSlide.classList.remove('_pause');
                        currentSlide.classList.add('_play');

                        [document.querySelector('.shorts__prev'), document.querySelector('.shorts__next')].forEach(btn => btn.classList.remove('_disabled'));
                        setTimeout(() => {
                            removeSkeleton(currentVideo);
                        }, 50);
                    }
                }, 450);
            }
        }, 100);
    }

    function videosPause() {
        const modalContainer = document.querySelector('.shorts-modal');
        const shorts = modalContainer.querySelectorAll('.swiper-slide._play');
        shorts.forEach(item => {
            item.classList.remove('_play');
            videojs(item.querySelector('.shorts__item')).pause();
            item.classList.add('_pause');
        })
    }

    function getCurrentVideo(slider) {
        return slider.slides[slider.realIndex].querySelector('.shorts__item');
    }

    function getCurrentSlideFromVideo(video) {
        return videojs(video).el_.closest('.swiper-slide');
    }
};

export default shorts;
