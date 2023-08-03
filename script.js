import apiKey from '/apikey.js'

const wrapper = document.querySelector('.wrapper');
const goBackBtn = wrapper.querySelector('header i');
const locationBtn = wrapper.querySelector('.location-btn')
const input = wrapper.querySelector('.wrapper input');
const infoTxt = wrapper.querySelector('.info-text');

let weatherIcon = wrapper.querySelector('.weather-part img');
// let temperature = ;
let cityName = wrapper.querySelector('.location span');
let Humidity = wrapper.querySelector('.humidity .numb');
let Pressure = wrapper.querySelector('.pressure .numb');
let weatherDescription = wrapper.querySelector('.weather');

let api;
// console.log(wrapper)

input.addEventListener("keyup", e =>{

    if(e.key == "Enter" && input.value != ""){

        requestApi(input.value);
        // wrapper.classList.add("active");


    }

});

locationBtn.addEventListener("click", () =>{

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }else{

        alert("Your browser not support geolocation api");

    }
});

const requestApi = (city) =>{

    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();

}

const onSuccess = (position) =>{

    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();

}

const onError = (error) =>{

    if(error.message === 'Network error. Check DevTools console for more information.'){

        infoTxt.innerText = 'Network error';

    }else{

        infoTxt.innerText = error.message;

    }

    infoTxt.classList.add("error");

}

const fetchData = ()=>{

    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(api)
    .then(res => res.json())
    .then(result => weatherDetails(result))
    .catch(() =>{

        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");

    });
}


const weatherDetails = (info) => {

    if(info.cod == "404"){

        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${input.value} isn't a valid city name`;

    }
    
    else{

        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, pressure, humidity} = info.main;

        if(id == 800){

            weatherIcon.src = "Images/clear.png";

        }else if(id >= 200 && id <= 232){

            weatherIcon.src = "Images/storm.png"; 

        }else if(id >= 600 && id <= 622){

            weatherIcon.src = "Images/snow.png";

        }else if(id >= 701 && id <= 781){

            weatherIcon.src = "Images/haze.png";

        }else if(id >= 801 && id <= 804){

            weatherIcon.src = "Images/cloudy.png";

        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){

            weatherIcon.src = "Images/rain.png";

        }
        
        wrapper.classList.add("active");
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        input.value = "";

        wrapper.querySelector('.weather-part .number').innerText = Math.floor(temp);
        weatherDescription.innerText = description;
        cityName.innerText = `${city}, ${country}`;
        Humidity.innerText = `${Math.floor(humidity)}%`;
        Pressure.innerText = `${Math.floor(pressure / 33.864)}"Hg`;

        // console.log(info);

    }

}

goBackBtn.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});