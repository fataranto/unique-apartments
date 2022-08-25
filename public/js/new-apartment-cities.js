

{
    // new-apartment - Dinamic States and Cities
    function setDynamicStates() {
        const states = ["Barcelona", "Girona", "Lleida", "Tarragona"];

        const state = document.querySelector('#state');
        const selected = state.options[state.selectedIndex].value;

        //console.log(selected);

        if (selected){
            state.innerHTML = '';
        }
        

        states.forEach(theState => {
            const option = document.createElement('option');
            option.value = theState;
            option.text = theState;
            if (theState === selected) {
                option.selected = true;
            }
            
            state.appendChild(option);
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
        //console.log("the cities", cities);
        const barcelona = cities[0];
        const girona = cities[1];
        const lleida = cities[2];
        const tarragona = cities[3];
    

    
        const city = document.querySelector('#city');
        const selected = city.options[city.selectedIndex].value;
        //console.log(!selected);
        const state = document.querySelector('#state');

        state.addEventListener('change', function (e) {
            let stateName = e.target.value;
            let theCities = (eval(stateName.toLowerCase()));
            city.innerHTML = "";
            theCities.forEach(theCity => {
                //console.log(theCity);
                const option = document.createElement('option');
                option.value = theCity.city;
                option.text = theCity.city;
                if (theCity.city === selected) {
                    option.selected = true;
                }
                city.appendChild(option);
            });
        });
        if(selected) {
            state.dispatchEvent(new Event('change'));
        }
    }
}