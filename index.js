'use strict';

let activitiesData;
let reportPeriod;
let menuButtons;

window.addEventListener('DOMContentLoaded', main);

async function main() {
    activitiesData = await getReportData();

    menuButtons = document.querySelectorAll('.menu__link');
    menuButtons[0].classList.add('active');
    reportPeriod = menuButtons[0].dataset.period.toLowerCase();

    reportPeriod = initCards(reportPeriod);
    menuButtons.forEach((button) =>
        button.addEventListener('click', changePeriod)
    );
}

async function getReportData() {
    return fetch('./data.json')
        .then((response) => response.json())
        .then((data) => data || [])
        .catch((error) => console.log(error));
}

function initCards(period) {
    const cardsContainer = document.getElementById('cards-container');
    const fragment = new DocumentFragment();

    if (activitiesData.length > 0) {
        activitiesData.forEach((card) => {
            const cardType = card.title.toLowerCase().replace(' ', '-');

            const cardWrapper = document.createElement('div');
            cardWrapper.classList.add(
                'dashboard__card-wrapper',
                `card--${cardType}`
            );
            cardWrapper.setAttribute('data-card-type', card.title);

            const dashboardCard = document.createElement('div');
            dashboardCard.classList.add('dashboard__card', 'card');

            const decorIcon = document.createElement('img');
            decorIcon.classList.add('dashboard__card-icon');
            decorIcon.setAttribute('src', `images/icons/icon-${cardType}.svg`);
            decorIcon.setAttribute('alt', `icon-${cardType}`);

            const cardActions = document.createElement('div');
            cardActions.classList.add('card__actions');

            const cardTitle = document.createElement('h3');
            cardTitle.classList.add('card__title');
            cardTitle.innerText = card.title;

            const cardButton = document.createElement('button');
            cardButton.classList.add('card__more-btn');
            cardButton.innerHTML = `
                <svg
                width="21"
                height="5"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                    fill="#BBC0FF"
                    fill-rule="evenodd" />
                </svg>
            `;

            const cardInfo = document.createElement('div');
            cardInfo.classList.add('card__info');

            const cardHours = document.createElement('div');
            cardHours.classList.add('card__hours');
            cardHours.innerText = `${card.timeframes[period].current}hrs`;

            const cardPrevHours = document.createElement('div');
            cardPrevHours.classList.add('card__previous-hours');
            cardPrevHours.innerText = `Yesterday - ${card.timeframes[period].previous}hrs`;

            cardInfo.append(cardHours, cardPrevHours);
            cardActions.append(cardTitle, cardButton);
            dashboardCard.append(cardActions, cardInfo);
            cardWrapper.append(dashboardCard, decorIcon);
            fragment.append(cardWrapper);
        });

        cardsContainer.append(fragment);
    }
}

function changePeriod(e) {
    e.preventDefault();

    const period = e.currentTarget.dataset.period;
    reportPeriod = period;

    if (menuButtons.length > 0) {
        menuButtons.forEach((button) => {
            if (button.dataset.period === period) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    const cards = document.querySelectorAll('.dashboard__card-wrapper');
    if (cards.length > 0) {
        cards.forEach((card) => {
            let currentPeriodText;
            let prevPeriodText;
            const cardType = card.dataset.cardType;
            const periodInfo = activitiesData.filter(
                (item) => item.title === cardType
            );

            const cardHours = card.querySelector('.card__hours');
            const cardPrevHours = card.querySelector('.card__previous-hours');

            if (periodInfo.length > 0) {
                currentPeriodText = `${periodInfo[0].timeframes[period].current}hrs`;
                switch (period) {
                    case 'daily': {
                        prevPeriodText = `Yesterday - ${periodInfo[0].timeframes[period].previous}hrs`;
                        break;
                    }
                    case 'weekly': {
                        prevPeriodText = `Last week - ${periodInfo[0].timeframes[period].previous}hrs`;
                        break;
                    }
                    case 'monthly': {
                        prevPeriodText = `Last month - ${periodInfo[0].timeframes[period].previous}hrs`;
                        break;
                    }
                    default:
                        prevPeriodText = `${periodInfo[0].timeframes[period].previous}hrs`;
                }
            } else {
                currentPeriodText = 'No data';
                prevPeriodText = 'No data';
            }

            cardHours.innerText = currentPeriodText;
            cardPrevHours.innerText = prevPeriodText;
        });
    }
}
