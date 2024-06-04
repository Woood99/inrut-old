import inputResize from "../modules/inputResize";
import inputCursorEnd from '../modules/inputCursorEnd';
import numberReplace from "../modules/numberReplace";

export const inputText = () => {
    const inputs = document.querySelectorAll('.input-text');
    if (inputs.length >= 1) {
        inputs.forEach(el => {
            inputTextBody(el);
        })
    }
}
export const inputSecond = () => {
    const items = document.querySelectorAll('.input-second');
    if (items.length === 0) return;
    items.forEach(item => {
        currentInputSecond(item);
    })
};
export const currentInputText = (input) => {
    if (!input) return;
    inputTextBody(input);
}

function inputTextBody(el) {
    if (!el) return;
    const input = el.querySelector('.input-text__input');
    if (!input) return;
    input.value.length >= 1 ? el.classList.add('_active') : el.classList.remove('_active');
    input.addEventListener('input', () => {
        if (el.classList.contains('input-text--only-number')) {
            input.value = input.value.replace(/\D/g, '');
            input.value = numberReplace(input.value);
        }
        if (el.classList.contains('input-text--only-number-default')) {
            input.value = input.value.replace(/\D/g, '');
        }
        input.value.length >= 1 ? el.classList.add('_active') : el.classList.remove('_active');
    });
    inputCursorEnd(input, 'focus');
}

export const inputOnlyNumber = () => {
    const inputs = document.querySelectorAll('[data-input-only-number]');
    if (inputs.length === 0) return;
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            const value = this.value;
            this.value = value.replace(/\D/g, '');
        })
    });
};
export const textareaSecondary = () => {
    const textareas = document.querySelectorAll('.textarea-secondary');
    textareas.forEach(textarea => {
        const textareaInput = textarea.querySelector('.textarea-secondary__input');
        const textareaMinHeight = textarea.dataset.textareaSecondaryMinHeight;
        const textareaMaxHeight = textarea.hasAttribute('data-textarea-secondary-max-height') ? textarea.dataset.textareaSecondaryMaxHeight : false;
        const textareaClear = textarea.querySelector('.textarea-secondary__clear');
        toggleActive(textareaInput, textarea);
        changeHeight();
        objectBaseComment();
        if (textareaMinHeight) textarea.style.minHeight = `${textareaMinHeight}px`;
        textareaInput.addEventListener('input', (e) => {
            toggleActive(e.target, textarea);
            changeHeight();
            objectBaseComment();
            if (textareaClear) {
                if (textareaInput.value.length >= 1) {
                    textareaClear.removeAttribute('hidden');
                } else {
                    textareaClear.setAttribute('hidden', '');
                }
            }
        });
        if (textareaClear) {
            textareaClear.addEventListener('click', () => {
                textareaInput.value = '';
                textareaClear.setAttribute('hidden', '');
                toggleActive(textareaInput, textarea);
                changeHeight();
                objectBaseComment();
                if (textareaInput.value.length >= 1) {
                    textareaClear.removeAttribute('hidden');
                } else {
                    textareaClear.setAttribute('hidden', '');
                }
            })
        }

        function changeHeight() {
            if (textareaMaxHeight) {
                textarea.style.height = `${textareaMinHeight}px`;
                if (textareaInput.scrollHeight + 2 <= textareaMaxHeight) {
                    textarea.style.height = `${textareaInput.scrollHeight + 2}px`;
                } else {
                    textarea.style.height = `${textareaMaxHeight}px`;
                }
            } else {
                textarea.style.height = `${textareaMinHeight}px`;
                textarea.style.height = `${textareaInput.scrollHeight + 2}px`;
            }
        }

        function objectBaseComment() {
            if (textarea.closest('.object-base-inner__comment')) {
                const saveBtn = textarea.nextElementSibling;
                if (textareaInput.value.length >= 1) {
                    saveBtn.removeAttribute('hidden');
                } else {
                    saveBtn.setAttribute('hidden', '');
                }
            }
        }
    });

    function toggleActive(target, currentTextarea) {
        target.value.length >= 1 ? currentTextarea.classList.add('_active') : currentTextarea.classList.remove('_active');
    }
};
export const textareaTags = () => {
    const textareas = document.querySelectorAll('.textarea-tags');
    textareas.forEach(textarea => {
        const listTag = textarea.querySelector('.textarea-tags__list');
        const textareaInput = textarea.querySelector('.textarea-tags__input');
        textareaInput.addEventListener('input', (e) => {
            changeHeight();
        });
        textareaInput.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
            if ((e.keyCode === 13 || e.key === ',') && textareaInput.value.length >= 2) {
                createTag(textareaInput.value);
                setTimeout(() => {
                    textareaInput.value = '';
                    changeHeight();
                }, 1);
            }
        })
        listTag.addEventListener('click', (e) => {
            const target = e.target;
            if (target.closest('.textarea-tags__tag-remove')) {
                const currentTag = target.closest('.textarea-tags__tag');
                currentTag.remove();
                updateTextarea(textarea);
                changeHeight();
            }
        })

        function changeHeight() {
            textarea.style.height = `${listTag.clientHeight + textareaInput.scrollHeight}px`;
        }

        function createTag(value) {
            const html = `
            <div class="textarea-tags__tag">
                <span data-tag-full-name="${value}">${valueDots(value)}</span>
                <svg class="textarea-tags__tag-remove" title="Удалить">
                    <use xlink:href="./img/sprite.svg#x"></use>
                </svg>
            </div>
           `;
            listTag.insertAdjacentHTML('beforeend', html);
            updateTextarea(textarea);
        }

        function valueDots(value) {
            const maxLength = 25;
            const result = `${value.substring(0, maxLength)}${value.length >= maxLength ? '...' : ''}`;
            return result;
        }

        function updateTextarea(textarea) {
            const items = textarea.querySelectorAll('.textarea-tags__tag');
            if (items.length > 0) {
                listTag.removeAttribute('hidden');
                textarea.classList.add('_active');
            } else {
                listTag.setAttribute('hidden', '');
                textarea.classList.remove('_active');
            }
        }
    });
};
export const inputClue = (target, name, html, addClass = false, stub = false) => {
    const targets = document.querySelectorAll(target);
    let timeout;
    targets.forEach(target => {
        target.addEventListener('click', () => {
            if (stub) {
                setTimeout(() => {
                    if (target.classList.contains('_clue')) {
                        body(targets, target);
                    }
                }, 5);
            } else {
                body(targets, target)
            }
        });
    })

    function body(targets, target) {
        const container = document.querySelector(`.${name}`);
        if (container) container.remove();
        targets.forEach(currentTarget => {
            if (target !== currentTarget) {
                currentTarget.classList.remove('_clue');
            }
        })
        document.body.insertAdjacentHTML('beforeend', html);
        setTimeout(() => {
            document.querySelector(`.${name}`).classList.add('is-open');
            if (addClass !== false) document.querySelector(`.${name}`).classList.add(addClass);
        }, 30);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            close(target);
        }, 4500);

        document.querySelector(`.${name} .${name}__close`).addEventListener('click', () => {
            clearTimeout(timeout);
            close(target);
        })
    }

    function close(target) {
        document.querySelector(`.${name}`).classList.remove('is-open');
        clearTimeout(timeout);
        setTimeout(() => {
            document.querySelector(`.${name}`).remove();
            target.classList.remove('_clue');
        }, 300);
    }
};


export const valueToValueAttr = (field) => {
    field.addEventListener('input', () => {
        field.setAttribute('value', field.value);
    })
}

export const currentInputSecond = (item) => {
    const input = item.querySelector('.input-second__input');
    body();
    input.addEventListener('input', () => {
        body();
    });
    inputCursorEnd(input, 'focus');

    function body() {
        if (item.classList.contains('_number-format')) {
            input.value = input.value.replace(/\D/g, '');
            input.value = numberReplace(input.value);
        }
        input.value.length > 0 ? item.classList.add('_active') : item.classList.remove('_active');
    }
}

document.querySelectorAll('.textarea-primary').forEach(textarea => {
    const field = textarea.querySelector('.textarea-primary__input');
    valueToValueAttr(field);
})
