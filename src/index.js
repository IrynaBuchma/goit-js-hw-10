import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetch-countries';


const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
    const name = countryInput.value.trim();
    if (name === '') {
        return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
    }

    fetchCountries(name)
        .then(countries => {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';
            if (countries.length === 1) {
                countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
            }
            else if (countries.length >= 2 && countries.length <= 10) {
                countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
            }
            else if (countries.length > 10) {
                alertTooManyCountries();
            }
            else if (!countries.ok) {
                throw Error(alertNoCountry);
            }
        })
        .catch(alertNoCountry);
}
    
function renderCountryList(countries) {
    const markup = countries.map(({ name, flags }) => {
        return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${flags.svg}" alt="flag of ${name.official}" height = 20px width = 30px />
            <span class="country-list__name">${name.official}</span>
        </li>`
    }).join('')

    return markup;
}

function renderCountryInfo(countries) {
    const markup = countries.map(({ name, flags, capital, population, languages }) => {
        return `
        <h1><img src="${flags.svg}" alt="flag of ${name.official}" height = 30px width = 60px/><span class="country-info__name">${name.official}</span></h1>
        <p><b>Capital: </b>${capital}</p>
        <p><b>Population: </b>${population}</p>
        <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`
    }).join('');

    return markup;
}

function alertTooManyCountries() {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
}

function alertNoCountry() {
    Notiflix.Notify.failure("Oops, there is no country with that name");
}