import { countries } from "./assets/countries.js";
const toggle = document.getElementById('toggle');
const logo = document.getElementById('logo');
const container = document.getElementById('container');
const translateFrom = document.getElementById('translate-from');
const translateTo = document.getElementById('translate-to');
const swapButton = document.getElementById('swap-button');
const copyFrom = document.getElementById('copy-from');
const copyTo = document.getElementById('copy-to');
const from = document.getElementById('from');
const to = document.getElementById('to');
const listenFrom = document.getElementById('listen-from');
const listenTo = document.getElementById('listen-to');
const translateButton = document.getElementById('translate-button')

let toggleDark = false;
let country_code;
let loading = false;


const reload = () => {
    location.reload()
}

const saveToLocalStorage = () => {
    localStorage.setItem('TranslateFrom', translateFrom.value);
    localStorage.setItem('TranslateTo', translateTo.value);
}

const toggleContainer = () => {
    toggleDark = !toggleDark

    if (toggleDark) {
        container.classList.add('dark-mode')
        toggle.innerHTML = "Disable Dark Mode";
    } else {
        if (container.classList) {
            container.classList.remove('dark-mode')
            toggle.innerHTML = "Enable Dark Mode";
        }
    }
}

for (country_code in countries) {
    const optionFrom = document.createElement('option');
    translateFrom.appendChild(optionFrom)
    optionFrom.value = countries[country_code];
    optionFrom.innerHTML = countries[country_code];

    const optionTo = document.createElement('option')
    translateTo.appendChild(optionTo);
    optionTo.value = countries[country_code]
    optionTo.innerHTML = countries[country_code]

    translateFrom.addEventListener('change', () => {
        saveToLocalStorage();
    })

    translateTo.addEventListener('change', () => {
        saveToLocalStorage();
    })
}

const swapLanguage = () => {
    const prevValue = translateFrom.value;
    translateFrom.value = translateTo.value;
    translateTo.value = prevValue;

    saveToLocalStorage();

}

const afterPageLoad = () => {
    translateFrom.value = localStorage.getItem('TranslateFrom')
    translateTo.value = localStorage.getItem('TranslateTo')
}

window.addEventListener('load', () => {
    if (localStorage.TranslateFrom && localStorage.TranslateTo) {
        afterPageLoad();
    }
})

const fromCopy = () => {
    if (from.value) {
        navigator.clipboard.writeText(from.value)
    }
}

const toCopy = () => {
    if (to.value) {
        navigator.clipboard.writeText(to.value)
    }
}

const listenFunc = (words) => {
    if ('speechSynthesis' in window) {
        const uttrerance = new SpeechSynthesisUtterance();

        if (from.value) {
            uttrerance.text = words
        }

        uttrerance.lang = 'en-US';

        speechSynthesis.speak(uttrerance);
    } else {
        console.error('Web speech API does not work at your browser!')
    }
}

const translate = () => {
    const apiURL = `https://api.mymemory.translated.net/get?q=${from.value}&langpair=${translateFrom.value}|${translateTo.value}`;

    try {
        fetch(apiURL).then((res) => {
            return res.json();
        }).then((res) => {

            if (res.responseData.translatedText) {
                loading = true;

                if (loading) {
                    to.value = res.responseData.translatedText;
                }
            } else {
                to.value = 'Your translated words are loading...';

                if(res.responseData.translatedText === null){
                    to.value = 'Not Found!'
                }


                return;
            }

        })
    } catch (error) {
        console.error(error)
    }
}

translateButton.addEventListener('click', () => {
    translate();
})

listenTo.addEventListener('click', () => {
    listenFunc(to.value);
})

listenFrom.addEventListener('click', () => {
    listenFunc(from.value);
})

listenTo.addEventListener('click', () => {

})

copyFrom.addEventListener('click', () => {
    fromCopy();
})

copyTo.addEventListener('click', () => {
    toCopy();
})

swapButton.addEventListener('click', () => {
    swapLanguage()
})

toggle.addEventListener('click', () => {
    toggleContainer()
})

logo.addEventListener('click', () => {
    reload();
})