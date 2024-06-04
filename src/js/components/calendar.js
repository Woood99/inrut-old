import {
    Calendar
} from 'fullcalendar';
import SimpleBar from 'simplebar';
import modal from '../modules/modal';
import numberReplace from '../modules/numberReplace';
import {
    galleryPrimaryBody
} from './gallery';
import {
    currentSimplebar
} from './simplebar';
import {
    getCurrentDateStringFormatDefault
} from '../modules/date';
export const calendarPrimary = (containerSelector, eventsSelector, edit = false) => {
    const calendarEl = document.querySelector(containerSelector);
    const calendarEvents = document.querySelector(eventsSelector);
    if (!(calendarEl && calendarEvents)) return;
    const array = JSON.parse(calendarEvents.value);
    const calendaryPrimary = new Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ru',
        dayMaxEvents: 1,
        firstDay: 1,
        moreLinkContent: (obj) => `+ еще ${obj.num}`,
        fixedWeekCount: false,
        eventClassNames: 'fc-event-container',
        eventSources: [array],
        headerToolbar: {
            center: 'title',
            right: 'customNext',
            left: 'customPrev',
        },
        eventContent: (obj) => {
            return {
                html: `
            <span>${obj.event._def.extendedProps.time}</span>
            <span>${obj.event._def.title}</span>
            `
            }
        },
        customButtons: {
            customPrev: {
                text: 'Предыдущий месяц',
                icon: 'chevron-left',
                click: function () {
                    calendaryPrimary.prev();
                    addedClassesCalendar();
                }
            },
            customNext: {
                text: 'Следующий месяц',
                icon: 'chevron-right',
                click: function () {
                    calendaryPrimary.next();
                    addedClassesCalendar();
                }
            },
        }
    })

    calendaryPrimary.render();
    eventModal(array);
    addedClassesCalendar();

    function eventModal(eventsArray) {
        calendarEl.addEventListener('click', (e) => {
            if (!(e.target.classList.contains('.fc-event') || e.target.closest('.fc-event'))) return false;
            const event = e.target.closest('.fc-event');
            const eventDate = event.closest('[data-date]').dataset.date;
            const modalHTML = `
            <div class="calendar-event" data-date="${eventDate}">
            <div class="calendar-event__container">
                <button class="btn-reset calendar-event__close" aria-label="Закрыть модальное окно">
                    <svg>
                        <use xlink:href="./img/sprite.svg#x"></use>
                    </svg>
                    <span>Закрыть</span>
                </button>
                <div class="calendar-event__content">
                    <ul class="calendar-event__list list-reset calendar-event-simplebar">

                    </ul>
                </div>
            </div>
            </div>
            `;
            modal(modalHTML, '.calendar-event', 300);
            let editHTML = '';
            if (edit) {
                editHTML = `
                <div class="calendar-event-item__bottom">
                    <button type="button" class="btn btn-reset calendar-event-item__cancel">
                        <svg>
                            <use xlink:href="./img/sprite.svg#x"></use>
                        </svg>
                        Отменить
                    </button>
                    <button type="button" class="btn btn-reset calendar-event-item__edit">
                        <svg>
                            <use xlink:href="./img/sprite.svg#pencil"></use>
                        </svg>
                        Редактировать
                    </button>
                </div>
                `;
            }
            eventsArray.forEach(el => {
                if (el.date === eventDate) {
                    const itemHTML = `
                <li class="calendar-event__item calendar-event-item">
                    <div class="calendar-event-item__time">
                        <svg>
                            <use xlink:href="./img/sprite.svg#clock"></use>
                        </svg>
                        <div>
                            <span>${el.time}</span>
                            <span>${el.date}</span>
                        </div>
                    </div>
                    <div class="calendar-event-item__location">
                        <svg>
                            <use xlink:href="./img/sprite.svg#location"></use>
                        </svg>
                        ${el.location}
                    </div>
                        <div class="calendar-event-item__title">
                            ${el.title}
                        </div>
                        <span class="calendar-event-item__price">${numberReplace(`${el.price}`)} ₽</span>
                        <div class="calendar-event-item__user user-info">
                            <div class="user-info__avatar avatar">
                                <img loading="lazy" src="${el.user.avatar}" width="32" height="32" alt="${el.user.name}">
                            </div>
                            <span class="user-info__name">
                                ${el.user.name}
                            </span>
                            <span class="user-info__pos">
                                ${el.user.pos}
                            </span>
                        </div>
                        ${editHTML}
                </li>
                    `;
                    document.querySelector('.calendar-event__list').insertAdjacentHTML('beforeend', itemHTML);
                }
            })
            const calendarEventSimplebar = document.querySelector('.calendar-event-simplebar');
            new SimpleBar(calendarEventSimplebar);
        });
    }

    function addedClassesCalendar() {
        setTimeout(() => {
            document.querySelectorAll('.fc-event-container').forEach(el => {
                if (el.closest('.fc-day')) el.closest('.fc-day').classList.add('fc-day-event');
            });
            document.querySelectorAll('.fc-day-event').forEach(el => {
                el.querySelectorAll('.fc-event--circle').forEach(circle => circle.remove());
                const events = el.querySelectorAll('.fc-event');
                for (let i = 0; i < events.length; i++) {
                    const circleHTML = `<span class="fc-event--circle">Событие</span>`;
                    events[0].insertAdjacentHTML('beforeend', circleHTML);
                }
            });
        }, 200);
    }
}

export const calendarSecondary = (containerSelector, eventsSelector, edit = false) => {
    const calendarEl = document.querySelector(containerSelector);
    const calendarEvents = document.querySelector(eventsSelector);
    if (!(calendarEl && calendarEvents)) return;
    const array = JSON.parse(calendarEvents.value);
    const calendaryPrimary = new Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ru',
        dayMaxEvents: 2,
        firstDay: 1,
        moreLinkContent: (obj) => `Смотреть все`,
        fixedWeekCount: false,
        eventClassNames: 'fc-event-container',
        eventSources: [array],
        headerToolbar: {
            center: 'title',
            right: 'customNext',
            left: 'customPrev',
        },
        eventContent: (obj) => {
            return {
                html: `
                <div class="fc-event-small" data-current-event-id='${obj.event._def.extendedProps.eventID}'>
                    <span>${obj.event._def.extendedProps.timeStart}</span>
                    <span>${obj.event._def.title}</span>
                </div>
            `
            }
        },
        customButtons: {
            customPrev: {
                text: 'Предыдущий месяц',
                icon: 'chevron-left',
                click: function () {
                    calendaryPrimary.prev();
                    btnAdded();
                }
            },
            customNext: {
                text: 'Следующий месяц',
                icon: 'chevron-right',
                click: function () {
                    calendaryPrimary.next();
                    btnAdded();
                }
            },
        }
    })
    const infoBlock = document.querySelector('.calendar-info');

    calendaryPrimary.render();
    eventModal(array);
    init();
    initInfo(array);
    btnAdded();

    function eventModal(eventsArray) {
        infoBlock.addEventListener('click', (e) => {
            const target = e.target;
            const event = target.closest('.fc-event-big');
            if (!event) return;
            const eventDate = infoBlock.dataset.currentDate;
            const eventID = event.dataset.currentEventId;
            eventGenerateModal(eventsArray, eventDate, eventID);
        });
    }

    function eventGenerateModal(eventsArray, eventDate, eventID) {
        const modalHTML = `
        <div class="calendar-event" data-date="${eventDate}">
        <div class="calendar-event__container">
            <button class="btn-reset calendar-event__close" aria-label="Закрыть модальное окно">
                <svg>
                    <use xlink:href="./img/sprite.svg#x"></use>
                </svg>
                <span>Закрыть</span>
            </button>
            <div class="calendar-event__content">
                <ul class="calendar-event__list list-reset calendar-event-simplebar">

                </ul>
            </div>
        </div>
        </div>
        `;
        modal(modalHTML, '.calendar-event', 300);
        const currentEventDate = eventsArray.filter(event => event.eventID == eventID);
        if (currentEventDate.length > 0) {
            const el = currentEventDate[0];
            let itemUsersHTML = '';
            let itemNotifHTML = '';
            let itemFilesHTML = '';
            let itemVideoMeetingHTML = '';
            el.participants.forEach(user => {
                const tag = user.link ? 'a' : 'div';
                itemUsersHTML += `
                    <${tag} ${tag === 'a' ? `href=${user.link}` : ''} class="event__user user-info user-info--small-mobile ${user.pos ? '' : 'user-info--name'} ${user.link ? '_hover' : ''}">
                        <div class="user-info__avatar avatar online">
                            <img loading="lazy" src="${user.avatar}" width="40" height="40" alt="${user.name}">
                        </div>
                        <span class="user-info__name" data-user-name-full="Лев Гаврилов">
                            ${user.name}
                        </span>
                            ${user.pos 
                            ? 
                            `
                            <span class="user-info__pos">
                            ${user.pos}
                            </span>
                            `
                            : ''
                        }
                    </${tag}>
                    `;
            });
            el.notifications.forEach(notif => {
                itemNotifHTML += `
                    <div class="event__notif">
                        <span>${notif.time}</span>
                        <span>${notif.method}</span>
                    </div>
                    `;
            });
            el.files.forEach(file => {
                itemFilesHTML += `
                    <a href="${file.link}" class="event__file file-small-block default-gallery__item">
                        <div class="file-small-block__image">
                            <img src="${file.link}" alt="${file.title}">
                        </div>
                        <span class="file-small-block__title">${file.title}</span>
                    </a>
                    `;
            });
            if (el.meeting) {
                itemVideoMeetingHTML = `
                <div class="event__link">
                    <h4 class="title-4 event__subtitle">Видеовстреча</h4>
                    <a href="${el.meeting}">${el.meeting}</a>
                </div>
                `
            }
            const itemHTML = `
                    <li class="calendar-event__item event" data-event-id="${el.eventID}">
                        <div class="event__header">
                            <a href="${el.linkEdit}" class="event__edit">
                                <svg>
                                    <use xlink:href="./img/sprite.svg#pencil">
                                    </use>
                                </svg>
                            </a>
                            <button type="button" class="btn btn-reset event__remove">
                                <svg>
                                    <use xlink:href="./img/sprite.svg#trash">
                                    </use>
                                </svg>
                            </button>
                        </div>
                        <div class="event__title">
                            <div class="title-4 event__subtitle">
                                Название
                            </div>
                            ${el.title}
                        </div>
                        ${itemVideoMeetingHTML ? itemVideoMeetingHTML : ''}
                        <div class="event__time">
                            <div class="title-4 event__subtitle">
                               Время и дата
                            </div>
                            <span>${getCurrentDateStringFormatDefault(el.date)}</span>
                            <span>${el.timeStart}</span>
                        </div>
                        <div class="event__descr">
                            <div class="title-4 event__subtitle">
                                Описание
                            </div>
                            ${el.descr}
                        </div>
                        <div class="event__object">
                            <h4 class="title-4 event__subtitle">Объект и адрес</h4>
                            <div class="object-small-card object-small-card--small">
                                <div class="object-small-card__image">
                                    <img loading="lazy" src="${el.object.image}" width="45" height="45" alt="${el.object.title}">
                                </div>
                                <h4 class="object-small-card__title">
                                    ${el.object.title}
                                </h4>
                                <p class="object-small-card__descr">
                                    ${el.object.address}
                                </p>
                            </div>
                        </div>
                        <div class="event__location">
                            <h4 class="title-4 event__subtitle">Адрес</h4>
                            <span>${el.object.address}</span>
                        </div>
                        <div class="event__users">
                            <h4 class="title-4 event__subtitle">Участники</h4>
                            ${itemUsersHTML}
                        </div>
                        <div class="event__notifs">
                            <h4 class="title-4 event__subtitle">Уведомления</h4>
                            ${itemNotifHTML}
                        </div>
                        <div class="event__files default-gallery">
                            <h4 class="title-4 event__subtitle">Файлы</h4>
                            <div>
                                ${itemFilesHTML}
                            </div>
                        </div>
                        <div class="event__controls">
                            <h4 class="title-4 event__subtitle">Придёте?</h4>
                            <div>
                                <button type="button" class="btn btn-reset tag">
                                    Да
                                </button>
                                <button type="button" class="btn btn-reset tag">
                                    Нет
                                </button>
                            </div>
                            <label class="textarea-primary">
                                <textarea class="input-reset textarea-primary__input" placeholder="Комментарий"></textarea>
                            </label>
                        </div>
                        <button type="button" class="btn btn-reset btn-secondary event__status js-popup-close">
                            ${el.status}
                        </button>
                    </li>
                `;
            document.querySelector('.calendar-event__list').insertAdjacentHTML('beforeend', itemHTML);
        }

        const modalContainer = document.querySelector('.calendar-event');
        const calendarEventSimplebar = modalContainer.querySelector('.calendar-event-simplebar');
        new SimpleBar(calendarEventSimplebar);

        const galleryFiles = modalContainer.querySelectorAll('.default-gallery');
        galleryFiles.forEach((gallery, index) => galleryPrimaryBody(gallery, `gallery-primary-container--default-${index+1}`, 'default-gallery__item'));
        modalContainer.addEventListener('click', (e) => {
            const target = e.target;
            const statusBtn = target.closest('.event__status');
            if (statusBtn) {
                const currentID = statusBtn.closest('.event').dataset.eventId;
                const currentEvents = document.querySelectorAll(`[data-current-event-id="${currentID}"]`);
                if (currentEvents.length > 0) {
                    currentEvents.forEach(item => item.classList.add('_active'))
                }
            }
        })
    }

    function btnAdded() {
        document.querySelectorAll('.fc-day.fc-daygrid-day').forEach(el => {
            const wrapper = el.querySelector('.fc-daygrid-day-frame');
            wrapper.insertAdjacentHTML('beforeend', generateBtnAdd(el.dataset.date));
        });
    }

    function generateBtnAdd(date) {
        const html = `
            <a href="#" data-current-date="${date}" class="btn btn-reset calendar-btn-add">
                <svg>
                <use xlink:href="./img/sprite.svg#plus"></use>
                </svg>
            </a>
        `;

        return html;
    }

    function getCurrentDate(currentDate) {
        const newDate = new Date(currentDate);
        const maps = {
            daysOfWeek: [
                'Воскресенье',
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Суббота',
            ],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            months2: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
        };
        const date = new Date(newDate.setDate(newDate.getDate()));
        return `
            ${maps.daysOfWeek[date.getDay()]}
            ${date.getDate()}
            ${maps.months2[maps.months.indexOf(maps.months[date.getMonth()])].toLowerCase()}
        `;
    }

    function generateAllInfo(eventsArray, currentDate) {
        infoBlock.innerHTML = '';
        const currentDateEvents = eventsArray.filter(item => item.date === currentDate);
        const currentDateTitle = `
            <div class="calendar-info__header">
                <h2 class="title-3" style="margin-bottom: 24px;">${getCurrentDate(currentDate)}</h2>
            </div>
        `;
        let eventsHTML = currentDateEvents.map(event => {
            const eventHTML = `
            <div class="fc-event-big" data-current-event-id="${event.eventID}">
                <div>
                    <span>${event.timeStart}</span>
                    <span>${event.title}</span>
                </div>
                <div class="object-small-card object-small-card--small">
                    <div class="object-small-card__image">
                        <img loading="lazy" src="${event.object.image}" width="45" height="45" alt="${event.object.title}">
                    </div>
                    <h4 class="object-small-card__title">
                        ${event.object.title}
                    </h4>
                    <p class="object-small-card__descr">
                        ${event.object.address}
                    </p>
                </div>
                <div class="fc-event-big__status">
                    <svg>
                        <use xlink:href="./img/sprite.svg#info"></use>
                    </svg>
                    ${event.statusApp}
                </div>
            </div>
            `;
            return eventHTML;
        });
        infoBlock.setAttribute('data-current-date', currentDate);
        infoBlock.insertAdjacentHTML('beforeend', currentDateTitle);
        infoBlock.insertAdjacentHTML('beforeend', `
            <div class="calendar-info__content simplebar-third">
                ${eventsHTML.length === 0 ? 'Нет планов' : eventsHTML.join('')}
            </div>
        `);
        currentSimplebar(infoBlock.querySelector('.calendar-info__content.simplebar-third'));
    }

    function initInfo(eventsArray) {
        const currentDateBlock = calendarEl.querySelector('.fc-day.fc-day-today.fc-daygrid-day');
        if (currentDateBlock) {
            const currentDate = currentDateBlock.dataset.date;
            generateAllInfo(eventsArray, currentDate);
        }
    }

    function init() {
        const newEvent = document.querySelector('.calendar-page__new-event');
        const to = calendarEl.querySelector('.fc-header-toolbar');
        to.insertAdjacentElement('beforeend', newEvent);
    }
    document.addEventListener('click', (e) => {
        const target = e.target;
        const createEvent = target.closest('.calendar-btn-add');
        const smallCard = target.closest('.fc-event-small');
        const dateBlock = target.closest('.fc-day.fc-daygrid-day');
        if (!createEvent && dateBlock) {
            const currentDate = dateBlock.dataset.date;
            if (smallCard) {
                const currentID = smallCard.dataset.currentEventId;
                eventGenerateModal(array, currentDate, currentID);
            } else {
                generateAllInfo(array, currentDate);
            }
        }
        if (createEvent) {
            document.location = `calendar-create-event.html?event=${createEvent.dataset.currentDate}`;
        }
    })
}
