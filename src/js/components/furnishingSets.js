import {
    currentDropImage
} from "../components/dropImage";
import {
    currentDragDrop
} from '../components/dragDrop';
import {
    currentVideoLoad
} from "./videoLoad";
import {
    currentInputText
} from "./inputs";
import {
    tabsControls
} from "../functions/tabs";
export const furnishingSets = () => {
    const containers = document.querySelectorAll('.furnishing-sets');
    if (!containers) return;
    containers.forEach(container => {
        container.querySelectorAll('.furnishing-sets__item').forEach(item => {
            furnishingSetsBody(item);
        })
    })
};
export const currentFurnishingSets = (item) => {
    furnishingSetsBody(item);
}



function furnishingSetsBody(item) {
    if (!item) return;
    const btnsContainer = item.querySelector('.furnishing-sets__btns');
    const contentContainer = item.querySelector('.furnishing-sets__tabs');
    const btns = item.querySelectorAll('.furnishing-sets__btn');
    const tabs = item.querySelectorAll('.furnishing-sets__tab');
    const mores = item.querySelectorAll('.furnishing-sets__more');
    initTabs(btns, tabs,mores);
    btnAction(item, btns, tabs, mores);
    const createRoom = item.querySelector('.furnishing-sets__create--room');
    if (createRoom) {
        createRoom.addEventListener('click', () => {
            const btns = item.querySelectorAll('.furnishing-sets__btn--room');
            const quantity = item.querySelectorAll('.furnishing-sets__btn');
            if (quantity.length === 0) {
                btnsContainer.insertAdjacentHTML('afterbegin', generateStudio());
            } else {
                const lastBtn = btns[btns.length - 1];
                const lastNumber = lastBtn ? lastBtn.querySelector('span').textContent : 0;
                btnsContainer.insertAdjacentHTML('beforeend', generateRoom(Number(lastNumber) + 1));
            }
            contentContainer.insertAdjacentHTML('beforeend', generateTabContent());
            btnAction(item, item.querySelectorAll('.furnishing-sets__btn'), item.querySelectorAll('.furnishing-sets__tab'));
            update(item.querySelector('.furnishing-sets__tab:last-child'));
            if (quantity.length === 8) {
                createRoom.setAttribute('hidden', '');
            }
            updateActiveTab(item);
            tabsControls(item.closest('.tabs-primary'));
        })
    }
}

function btnAction(item, btns, tabs, mores) {
    btns.forEach((btn, indexBtn) => {
        btn.addEventListener('click', (e) => {
            const remove = e.target.closest('.furnishing-sets__btn-remove');
            if (remove) {
                const activeBtnIndex = Array.prototype.indexOf.call(btns, btn);
                const currentContent = tabs[activeBtnIndex];

                btn.remove();
                currentContent.remove();
                if (item.querySelectorAll('.furnishing-sets__btn').length < 9) {
                    const createRoom = item.querySelector('.furnishing-sets__create--room');
                    createRoom.removeAttribute('hidden');
                }
                updateActiveTab(item);
                tabsControls(item.closest('.tabs-primary'));
            } else {
                btns.forEach(btn => btn.classList.remove('_active'));
                btn.classList.add('_active');
                tabs.forEach((tab, indexTab) => {
                    if (indexBtn !== indexTab) {
                        tab.setAttribute('hidden', '')
                    } else {
                        tab.removeAttribute('hidden');
                    }
                })
                if (mores && mores.length > 0) {
                    mores.forEach((more, indexMore) => {
                        if (indexBtn !== indexMore) {
                            more.setAttribute('hidden', '')
                        } else {
                            more.removeAttribute('hidden');
                        }
                    })
                }
            }
        });
    })
}

function generateRoom(number) {
    const roomHTML = `
        <button type="button" class="btn btn-reset furnishing-sets__btn furnishing-sets__btn--room furnishing-sets__btn--controls">
            <span>${number}</span>
            <div class="furnishing-sets__btn-remove">
                <svg>
                  <use xlink:href="./img/sprite.svg#trash"></use>
                </svg>
            </div>
        </button>
        `;
    return roomHTML;
}

function generateTabContent() {
    const contenHTML = `
        <div class="furnishing-sets__tab" hidden>
            <div class="photo-load">
                <div class="place-sale-photo__images drag-drop photo-load__images">
                </div>
                <div class="place-sale-photo__wrapper photo-load__wrapper">
                    <button type="button" class="btn btn-reset">
                        <p>
                            <span class="btn btn-reset btn-primary">Выберите фото</span> <span>или перетащите в эту область</span>
                        </p>
                    </button>
                    <input type="file" data-upload-drop="" name="upload" multiple="" accept=".jpg, .png, .jpeg, .heic" class="input-reset">
                </div>
            </div>
            <label class="place-sale-textarea textarea-primary" style="margin-top: 24px;">
                <textarea class="input-reset textarea-primary__input" placeholder="Описание к фотографии"></textarea>
            </label>
            <div class="row">
            <div class="place-sale-field-price input-text input-text--only-number" style="max-width: 350px;">
                <label class="input-text__label">
                    <span>Стоимость от</span>
                    <input type="text" name="Цена" maxlength="12" class="input-reset input-text__input" placeholder="">
                    <span>₽</span>
                </label>
            </div>
            <div class="place-sale-price__tooltip secondary-tooltip secondary-tooltip--dark" style="margin-left: 8px;">
                <button type="button" class="btn btn-reset secondary-tooltip__btn">
                    <svg>
                        <use xlink:href="./img/sprite.svg#info"></use>
                    </svg>
                </button>
                <div class="secondary-tooltip__content">
                    Стоиомость комплекта меблировки
                </div>
            </div>
        </div>
        <div class="photo-load pdf-load">
        <div class="place-sale-photo__images drag-drop photo-load__images">
        </div>
        <div class="place-sale-photo__wrapper photo-load__wrapper">
            <button type="button" class="btn btn-reset">
                <p>
                    <span class="btn btn-reset btn-primary">Добавьте PDF полного состава комплекта </span> <span>или перетащите в
                        эту область</span>
                </p>
            </button>
            <input type="file" data-upload-drop data-upload-drop-pdf name="upload" accept="application/pdf" class="input-reset">
        </div>
        </div>
        </div>
        `;
    return contenHTML;
}

function generateStudio() {
    const studioHTML = `
            <button type="button" class="btn btn-reset furnishing-sets__btn furnishing-sets__btn--studio furnishing-sets__btn--controls">
                <span>Студия</span>
                <div class="furnishing-sets__btn-remove">
                    <svg>
                      <use xlink:href="./img/sprite.svg#trash"></use>
                    </svg>
                </div>
            </button>
            `;
    return studioHTML;
}

function renamingTitle(titles) {
    const newTitles = Array.prototype.slice.call(titles, 0).filter(title => title.classList.contains('furnishing-sets__btn--room'));
    newTitles.forEach((title, index) => {
        title.querySelector('span').textContent = index + 1;
    })
}

function update(content) {
    if (content) {
        const inputs = content.querySelectorAll('.input-text');
        const photoLoads = content.querySelectorAll('.video-load');
        const dropImages = content.querySelectorAll('.photo-load');
        const dragDrops = content.querySelectorAll('.drag-drop');

        photoLoads.forEach(item => currentVideoLoad(item));
        dropImages.forEach(item => currentDropImage(item));
        dragDrops.forEach(item => currentDragDrop(item));
        inputs.forEach(item => currentInputText(item));
    }
}

function updateActiveTab(container) {
    if (container) {
        const navActive = container.querySelector('.furnishing-sets__btns .furnishing-sets__btn._active');
        if (!navActive && container.querySelector('.furnishing-sets__btns .furnishing-sets__btn')) {
            const firstTitle = container.querySelectorAll('.furnishing-sets__btns .furnishing-sets__btn')[0];
            const firstTab = container.querySelectorAll('.furnishing-sets__tabs .furnishing-sets__tab')[0];
            firstTitle.classList.add('_active');
            firstTab.removeAttribute('hidden');
        }
    }
}



function initTabs(btns, tabs,mores) {
    const btnsArray = Array.prototype.slice.call(btns, 0);
    const activeBtn = btnsArray.find(btn => {
        return btn.classList.contains('_active');
    })
    const activeBtnIndex = btnsArray.indexOf(activeBtn);
    tabs.forEach((tab, indexTab) => {
        if (activeBtnIndex !== indexTab) {
            tab.setAttribute('hidden', '')
        } else {
            tab.removeAttribute('hidden');
        }
    })
    if (mores.length > 0) {
        mores.forEach((more, indexMore) => {
            if (activeBtnIndex !== indexMore) {
                more.setAttribute('hidden', '')
            } else {
                more.removeAttribute('hidden');
            }
        })
    }
}
