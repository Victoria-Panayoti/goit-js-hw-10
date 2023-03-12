export const fetchCountries = function (name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then(responce => {
            if (!responce.ok) {
                throw new Error(responce.status);
            }
            return responce.json();
    })
}