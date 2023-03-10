import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  event.preventDefault();
  const countrySearch = event.target.value.trim();
  if (countrySearch === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(countrySearch)
    .then(responce => {
      if (responce.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (responce.length > 1 && responce.length <= 10) {
        refs.countryInfo.innerHTML = '';
        renderList(responce);
        return;
      }

      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';

      renderInfo(responce);
    })
    .catch(error => {
      refs.countryInfo.innerHTML = '';
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderList(responce) {
  const markupList = responce
    .map(
      item => `
      <li class="country-item">
        <img class="flag" src="${item.flags.svg}" alt="${item.flags.alt}">
        <p>${item.name.official}</p>
      </li>`
    )
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markupList);
}

function renderInfo(responce) {
  const markupInfo = responce
    .map(
      item => `
      <table>
        <tr>
          <th><img class="flag-info" src="${item.flags.svg}" alt="${
        item.flags.alt
      }"></th>
          <th>${item.name.official}</th>
        </tr>
        <tr>
          <td class="property">Capital:</td>
          <td>${item.capital}</td>
        </tr>
        <tr>
          <td class="property">Population:</td>
          <td>${item.population}</td>
        </tr>
        <tr>
          <td class="property">Languages:</td>
          <td>${Object.values(item.languages).join(', ')}</td>
        </tr>
      </table>
        `
    )
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
}
