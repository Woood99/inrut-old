import 'focus-visible';
import "./functions/dynamic-adapt";
import "./functions/sliders";
import './functions/fix-fullheight';
import './_popups';
import './_main-scripts';
import { _slideDown } from './support-modules/slide';
import getRemainingScrollToBottom from './modules/getRemainingScrollToBottom';
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    const comparison = document.querySelector('.comparison-block');
    if (!comparison) return;

    const headers = Array.from(document.querySelectorAll('.comparison-header'));
    const blocks = Array.from(comparison.querySelectorAll('[data-comparison-block]'));
    const tabsBlock = comparison.querySelector('[data-tabs]');
    setNumberCards();
    setBestField();
    headers.forEach(header => nav(header));

    if (tabsBlock) {
        setWidthOptions.call(tabsBlock);
        tabsBlock.addEventListener('tabChange', setWidthOptions.bind(tabsBlock));
    }

    if (document.querySelector('.comparison-header') && document.querySelector('.comparison-header').innerHTML.trim() !== '') {
        comparisonHeaderToggle();
        window.addEventListener('scroll', comparisonHeaderToggle);
    }

    function setNumberCards() {
        blocks.forEach(item => body(item));

        function body(comparison) {
            const cards = comparison.querySelectorAll('.comparison-block__card');
            const length = cards.length;
            if (length === 0) return;
            cards.forEach((card, index) => {
                const number = card.querySelector('.comparison-card__number');
                number.textContent = `${index+1}/${length}`;
            })
        }
    }

    function nav(header) {
        const comparison = blocks.find(item => item.dataset.comparisonBlock == header.dataset.comparisonHeader);
        if (!comparison) return;
        const blockPrev = comparison.querySelector('.comparison-block__prev');
        const blockNext = comparison.querySelector('.comparison-block__next');

        const headerPrev = header.querySelector('.comparison-header__prev');
        const headerNext = header.querySelector('.comparison-header__next');

        blockPrev.addEventListener('click', () => {
            const formula = getScrollLeft() - getWidth();
            body(formula);
        });
        blockNext.addEventListener('click', () => {
            const formula = getScrollLeft() + getWidth();
            body(formula);
        });


        if (header && headerPrev && headerNext) {
            headerPrev.addEventListener('click', () => {
                const formula = getScrollLeft() - getWidth();
                body(formula);
            });
            headerNext.addEventListener('click', () => {
                const formula = getScrollLeft() + getWidth();
                body(formula);
            });
        }

        function body(formula) {
            const spollers = comparison.querySelectorAll('.comparison-block__body .spollers__item');

            const bodyTop = comparison.querySelector('.comparison-block__top-container');
            const bodyMain = comparison.querySelector('.comparison-block__body');

            let speed = 0;
            spollers.forEach(item => {
                if (!item.classList.contains('_active')) {
                    speed = 500;
                    item.classList.add('_active');
                    _slideDown(item.querySelector('.spollers__body'));
                }
            })
            interimDisabledNavBtn();

            setTimeout(() => {
                bodyTop.scrollTo({
                    left: formula,
                    behavior: 'smooth',
                })
                bodyMain.scrollTo({
                    left: formula,
                    behavior: 'smooth',
                })

                const headerList = header ? header.querySelector('.comparison-header__list') : null;
                if (headerList) {
                    headerList.scrollTo({
                        left: formula,
                        behavior: 'smooth',
                    })
                }
                setTimeout(() => {
                    checkNavBtn();
                }, 500);
            }, speed);
        }

        function getWidth() {
            return comparison.querySelector('.comparison-block__col-top').getBoundingClientRect().width;
        }

        function getScrollLeft() {
            return comparison.querySelector('.comparison-block__top-container').scrollLeft;
        }

        function checkNavBtn() {
            blockPrev.classList.remove('_disabled');
            blockNext.classList.remove('_disabled');

            headerPrev.classList.remove('_disabled');
            headerNext.classList.remove('_disabled');

            const bodyTop = comparison.querySelector('.comparison-block__top-container');

            if (bodyTop.scrollLeft === 0) {
                blockPrev.classList.add('_disabled-hidden');
                headerPrev.classList.add('_disabled-hidden');

                comparison.classList.remove('_scroll');
            } else {
                blockPrev.classList.remove('_disabled-hidden');
                headerPrev.classList.remove('_disabled-hidden');

                comparison.classList.add('_scroll');
            }

            if (bodyTop.scrollLeft >= (bodyTop.scrollWidth - bodyTop.clientWidth - 20)) {
                blockNext.classList.add('_disabled-hidden');
                headerNext.classList.add('_disabled-hidden');
            } else {
                blockNext.classList.remove('_disabled-hidden');
                headerNext.classList.remove('_disabled-hidden');
            }
        }

        function interimDisabledNavBtn() {
            blockPrev.classList.add('_disabled');
            blockNext.classList.add('_disabled');

            headerPrev.classList.add('_disabled');
            headerNext.classList.add('_disabled');
        }
    }

    function comparisonHeaderToggle() {
        const currentHeader = headers.find(item => !item.hasAttribute('hidden'));
        const currentID = currentHeader.dataset.comparisonHeader;
        const currentBlock = document.querySelector(`[data-comparison-block="${currentID}"]`);

        const top = currentBlock.querySelector('.comparison-block__top');
        const topContainer = currentBlock.querySelector('.comparison-block__top-container');

        const posTop = top.getBoundingClientRect().top;
        if (posTop + topContainer.clientHeight <= 0 && getRemainingScrollToBottom() > 250) {
            currentHeader.classList.add('_active');
        } else {
            currentHeader.classList.remove('_active');
        }

    }

    function setBestField() {
        const fields = comparison.querySelectorAll('[data-comparison-field]');
        fields.forEach(field => {
            if (field.dataset.comparisonField === 'down') {
                body(field, 'down');
            }
            if (field.dataset.comparisonField === 'up') {
                body(field, 'up');
            }
        })


        function body(field, action) {
            const items = Array.from(field.querySelectorAll('.comparison-block__col'));
            if (items.length == 0) return;

            let currentItem = items[0];
            for (let i = 1; i < items.length; i++) {
                const elem = items[i];
                const currentSpan = getSpan(elem);

                const prevSpan = getSpan(currentItem);
                if (currentSpan && currentSpan.textContent.length > 0 && currentItem && prevSpan.textContent.length > 0) {

                    if (action === 'down') {
                        if (currentSpan.textContent.replace(/\D/g, '') < prevSpan.textContent.replace(/\D/g, '')) {
                            currentItem = elem;
                        }
                    }

                    if (action === 'up') {
                        if (currentSpan.textContent.replace(/\D/g, '') > prevSpan.textContent.replace(/\D/g, '')) {
                            currentItem = elem;
                        }
                    }

                }
            }


            function getSpan(el) {
                return el.querySelector('span');
            }


            if (getSpan(currentItem)) {
                getSpan(currentItem).classList.add('_active');
            }


        }

    }

    function setWidthOptions() {
        const activeBody = this.activeBody;
        if (activeBody.classList.contains('_init')) return;
        activeBody.classList.add('_init');

        const top = activeBody.querySelector('.comparison-block__top-container');
        if (!top) return;
        activeBody.style.setProperty('--width-option', `${Math.ceil((top.scrollWidth / 100) * 120)}px`);
        activeBody.style.setProperty('--width-option-line', `${Math.ceil(top.scrollWidth)}px`);
    }

})