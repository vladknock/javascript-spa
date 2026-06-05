// МОБИЛЬНАЯ НАВИГАЦИЯ
const mobileNav = document.getElementById("mobile-navigation");
const burgerBtn = document.querySelector(".burger");

burgerBtn.addEventListener("click", () => mobileNav.showModal());
mobileNav.addEventListener("click", (event) => {
    const navLink = event.target.closest("a");

    if (!navLink) return;

    mobileNav.close()
})

// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
const themeBtn = document.getElementById("theme-toggle");

themeBtn.addEventListener("click", () => document.body.classList.toggle("dark-theme"));

// РАБОТА АККОРДЕОНОВ БЛОКА "ПРЕИМУЩЕСТВА 2" НА МОБИЛЬНОЙ ВЕРСИИ
const accordsList = document.querySelectorAll("[data-mobile-accord] .expand-field");

accordsList.forEach( (accord) => accord.addEventListener("click", handleMobileAccord) );

function handleMobileAccord(event) {
    const accord = event.currentTarget;
    const isExpanded = accord.getAttribute("aria-expanded") === "true";

    accord.setAttribute("aria-expanded", !isExpanded);
}

// РАБОТА TABS "ТАРИФОВ" НА МОБИЛ. ВЕРСИИ СТРАНИЦЫ
const subsContainer = document.querySelector(".subscriptions");
let currentTab = null;

subsContainer.addEventListener("click", (event) => {
    const tab = event.target.closest("[role='tab']");

    if (!tab) return;
    
    const tabID = tab.getAttribute("aria-controls");

    const panelsList = subsContainer.querySelectorAll("[role='tabpanel']");
    panelsList.forEach( panel => panel.style.display = 'none' );

    const panel = document.getElementById(tabID);
    panel.style.display = 'grid';

    tab.setAttribute("aria-selected", "true");

    if (tab.dataset.used === "false") {
        tab.dataset.used = "true";
        tab.previousElementSibling.setAttribute("aria-selected", "false")
    }

    if (!currentTab) currentTab = tab;

    if (currentTab.getAttribute("aria-controls") !== tabID) {
        const isSelected = tab.getAttribute("aria-selected") === "true";
        currentTab.setAttribute("aria-selected", !isSelected);
        currentTab = tab;
    }
});

// СБРОС МОБИЛЬНОЙ ФУНКЦИОНАЛЬНОСТИ 
const mediaQuery = window.matchMedia("(min-width: 769px)");

function handleMobileDisplay(event) {
    if (event.matches) {
        subsContainer.querySelectorAll("[role='tabpanel']")
            .forEach( panel => panel.style.display = 'grid' )
    } else {
        const panelID = subsContainer.querySelector("[aria-selected='false']")
            .getAttribute("aria-controls");
        document.getElementById(panelID).style.display = "none"
    }

    if (event.matches && mobileNav.open) {
        mobileNav.close()
    }
}

mediaQuery.addEventListener("change", handleMobileDisplay)

// =====================================
// ВАЛИДАЦИЯ ФОРМ
// =====================================
const errorMessages = {
    valueMissing: ({ type }) => {
        if (type !== "checkbox") {
            return "Поле обязательно!";
        } else {
            return "Пожалуйста, отметьте, что Вы согласны!";
        }
    },
    typeMismatch: () => "Введеное значение не соответствует типу!",
    tooShort: ({ minLength }) =>
        `Слишком короткое значение! Минимально символов - ${minLength}`,
    tooLong: ({ maxLength }) =>
        `Слишком большое значение! Максимально символов - ${maxLength}`,
    patternMismatch: () =>
        `Введенное значение не соответствует требованиям!`,
}


document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-js-form]");

    if (!form) return;

    event.preventDefault();
    form.querySelectorAll("[data-error-field]")
        .forEach(err => err.classList.remove("active"));

    if (!form.checkValidity()) {
        const data = form.elements;
        Array.from(data)
            .filter(field => field.name)
            .forEach(field => {
                if (!field.validity.valid) {
                    const errorField = field.parentElement.querySelector("[data-error-field]");

                    showError(field, errorField);
                    console.log("Not valid!");
                }
            });
    } else {
        if (form.closest(".feedback-form [data-js-form]")) {
            const successElement = document.getElementById("success");

            successElement.classList.add("active");
            setTimeout(() => successElement.classList.remove("active"), 1500);
        }
    }
});

function showError(InputElement, InputElementErrorField) {
    if (InputElement) {
        for (const errorType in errorMessages) {
            if (InputElement.validity[errorType]) {
                InputElementErrorField.textContent = errorMessages[errorType](InputElement);
                console.log(errorMessages[errorType](InputElement));
                break;
            }
        }
    }
        // Add the `active` class
    InputElementErrorField.classList.add("active");
}

