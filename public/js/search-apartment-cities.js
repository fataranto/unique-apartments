{
    const barcelona = '/data/barcelona.json';
    const girona = '/data/girona.json';
    const tarragona = '/data/tarragona.json';
    const lleida = '/data/lleida.json';


    const cities = [];
    fetch(barcelona)
        .then(blob => blob.json())
        .then(data => cities.push(...data))

    fetch(girona)
        .then(blob => blob.json())
        .then(data => cities.push(...data))

    fetch(tarragona)
        .then(blob => blob.json())
        .then(data => cities.push(...data))

    fetch(lleida)
        .then(blob => blob.json())
        .then(data => cities.push(...data))

    function findMatches(wordToMatch, cities) {
        return cities.filter((place, i) => {
            const regex = new RegExp(wordToMatch, 'gi');


            return place.city.match(regex);

        });
    }

    function displayMatches() {
        if (this.value.length === 0) {
            const suggestions = document.querySelector('#suggestions');
            suggestions.innerHTML = '';
            return;
        }

        const matchArray = findMatches(this.value, cities);


        const html = matchArray.map((place, i) => {

            if (i < 5) {

                const regex = new RegExp(this.value, 'gi');
                const cityName = place.city;
                const stateName = place.state;

                return `
  <li data-city='${cityName}' data-state='${stateName}'>
        <span class="name">${cityName}, ${stateName}</span>
      </li>
  `;
            }

        }).join('');
        suggestions.innerHTML = html;

        const li = document.querySelectorAll('#suggestions li');

        li.forEach(li => {
            //console.log(li);
            li.addEventListener('mouseup', () => {
                const city = li.getAttribute('data-city');
                cityInput.value = city;
                const state = li.getAttribute('data-state');
                stateInput.value = state;
                searchInput.value = li.innerText;
                suggestions.innerHTML = '';
            })
            li.addEventListener('mouseenter', () => {
                li.classList.add('bg-light');
            })
            li.addEventListener('mouseleave', () => {
                li.classList.remove('bg-light');
            })
        })

    }




    const searchInput = document.querySelector('#searchCity');
    const suggestions = document.querySelector('#suggestions');
    const cityInput = document.querySelector('#city');
    const stateInput = document.querySelector('#state');

    searchInput.addEventListener('change', displayMatches);
    searchInput.addEventListener('keyup', displayMatches);
    searchInput.addEventListener('focus', () => {
        searchInput.value = '';
    })

}