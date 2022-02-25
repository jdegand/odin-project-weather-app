(function(){

    document.getElementById('submit').addEventListener('click', fetchWeather);
    const form = document.forms["locationForm"];

    const loader = document.getElementById("loading");
    const changesEveryday = 'justcors-value-goes-here'

    function displayLoading() {
        loader.classList.add("display");
    }

    function hideLoading() {
        loader.classList.remove("display");
    }

    function fetchWeather(e){
        e.preventDefault();
        displayLoading();

        document.querySelector(".table-wrapper").setAttribute("aria-busy", "true");

        const start = Date.now();

        let userChoice = form.location.value.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');

        fetch(`https://justcors.com/${changesEveryday}/https://weatherdbi.herokuapp.com/data/weather/${userChoice}`)
        .then(res=>res.json())
        .then(json=> {
            //console.log(json)
            hideLoading()

            document.querySelector(".table-wrapper").setAttribute("aria-busy", "false");

            removeAllChildNodes(document.getElementById('current'));
            removeAllChildNodes(document.querySelector('thead'));
            removeAllChildNodes(document.querySelector('tbody'));

            const millis = Date.now() - start;

            const fetchTime = document.createElement('p');

            fetchTime.textContent = `seconds elapsed = ${(millis / 1000).toFixed(2)}`

            const currentImage = document.createElement('img');
            currentImage.src = json.currentConditions.iconURL;
            currentImage.alt = json.currentConditions.comment;

            const dayHour = document.createElement('p');
            dayHour.textContent = json.currentConditions.dayhour;

            const currentTemp = document.createElement('p');
            currentTemp.textContent = form.scale.value === 'fahrenheit' ? json.currentConditions.temp.f + "F°" : json.currentConditions.temp.c + "C°";

            document.getElementById('current').append(fetchTime, currentImage, dayHour, currentTemp);

            for(const day of json.next_days){
                //console.log(day)

                const heading = document.createElement("th");
                heading.textContent = day.day;

                document.querySelector('thead').appendChild(heading);

                const cell = document.createElement("td")
                const text = document.createElement("p");
                const image = document.createElement("img");

                image.src = day.iconURL;
                image.alt = day.comment;

                text.textContent = form.scale.value === 'fahrenheit' ? day.max_temp.f + "F°" : day.max_temp.c + "C°";

                cell.appendChild(image);
                cell.appendChild(text);

                document.querySelector('tbody').appendChild(cell);

                let caption = document.querySelector('table').createCaption();
                caption.textContent = `High Temps from Extended Week Ahead in ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)}`;

            }

            form.location.value = '';

        })
    }


    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

})();