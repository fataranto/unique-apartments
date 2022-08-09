

{
    // new-apartment
    function setDynamicStates() {
        const states = ["Barcelona", "Girona", "Lleida", "Tarragona"];

        const state = document.querySelector('#state');

        states.forEach(option => {
            state.appendChild(new Option(option, option));
            //console.log(option.label);
        });
    }

    setDynamicStates();


    Promise.all([
        fetch("/data/barcelona.json"),
        fetch("/data/girona.json"),
        fetch("/data/lleida.json"),
        fetch("/data/tarragona.json")
    ]).then(responses => {
        return Promise.all(responses.map(response => response.json()));
    }).then(data => {
        setDynamicCities(data);
    }).catch(error => {
        console.log(error);
    });

    function setDynamicCities(cities) {
        console.log("the cities", cities);
        const barcelona = cities[0];
        const girona = cities[1];
        const lleida = cities[2];
        const tarragona = cities[3];
    
        const city = document.querySelector('#city');
        const state = document.querySelector('#state');
        state.addEventListener('change', function (e) {
            let stateName = e.target.value;
            let theCities = (eval(stateName.toLowerCase()));
            city.innerHTML = "";
            theCities.forEach(option => {
                let cityName = option.city;
                city.appendChild(new Option(cityName, cityName));
            });
    });
    }
}