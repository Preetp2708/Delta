
// --- DOG API ---
const dogImgContainer = document.querySelector('.dog-img-container');
const dogRefreshBtn = document.getElementById('dog-refresh');
const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';

async function fetchDogImage() {
  dogImgContainer.innerHTML = '<span style="color:#aaa">Loading...</span>';
  try {
    const response = await axios.get(DOG_API_URL);
    const data = response.data;
    dogImgContainer.innerHTML = '';
    if (data && data.message) {
      const img = document.createElement('img');
      img.src = data.message;
      img.alt = 'Random Dog Image';
      img.className = 'dog-image';
      dogImgContainer.appendChild(img);
    }
  } catch (err) {
    dogImgContainer.innerHTML = '<span style="color:red">Failed to load image.</span>';
    console.error(err);
  }
}

dogRefreshBtn.addEventListener('click', fetchDogImage);
window.addEventListener('DOMContentLoaded', fetchDogImage);

// --- COUNTRY API ---
const con = document.getElementById('con');
const countrySearchBtn = document.getElementById('country-search');
const COUNTRY_API_URL = 'https://restcountries.com/v3.1/alpha/';

const cname = document.querySelector('.name');
const cpop = document.querySelector('.pop');
const ccurrency = document.querySelector('.currency');
const flagContainer = document.querySelector('.flag-container');

function clearCountryResult() {
  cname.innerHTML = 'Your are searched country ::';
  cpop.innerHTML = 'Population of country ::';
  ccurrency.innerHTML = 'Currency ::';
  flagContainer.innerHTML = '';
}

countrySearchBtn.addEventListener('click', async () => {
  const value = con.value.trim();
  if (!value) {
    clearCountryResult();
    cname.innerHTML += ' <b style="color:red">Please enter a country code.</b>';
    return;
  }
  const search = COUNTRY_API_URL + value;
  clearCountryResult();
  try {
    const response = await fetch(search);
    const data = await response.json();
    if (data && data[0]) {
      // Country name
      const n = document.createElement('b');
      n.innerText = data[0].name.common;
      cname.appendChild(n);

      // Population
      const p = document.createElement('b');
      p.innerText = data[0].population.toLocaleString();
      cpop.appendChild(p);

      // Currency (object, not array)
      const currencies = data[0].currencies;
      let currencyName = '';
      if (currencies) {
        const keys = Object.keys(currencies);
        if (keys.length > 0) {
          currencyName = currencies[keys[0]].name;
        }
      }
      const c = document.createElement('b');
      c.innerText = currencyName;
      ccurrency.appendChild(c);

      // Country flag
      if (data[0].flags && data[0].flags.png) {
        const flagImg = document.createElement('img');
        flagImg.src = data[0].flags.png;
        flagImg.alt = 'Country Flag';
        flagImg.className = 'country-flag';
        flagContainer.appendChild(flagImg);
      }
    } else {
      cname.innerHTML += ' <b style="color:red">Country not found.</b>';
    }
  } catch (error) {
    cname.innerHTML += ' <b style="color:red">Error fetching data.</b>';
    console.error(error);
  }
});
