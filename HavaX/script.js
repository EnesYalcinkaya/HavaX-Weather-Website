const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = document.querySelector("header i");
let api;

inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        console.log("Tarayıcınız geolocation'ı desteklemiyor...");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=a16e33bdb752c9b5778d38c42614a6e4`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a16e33bdb752c9b5778d38c42614a6e4`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Sonuçlar getiriliyor...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} şehri bulunamadı...`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "icons/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".location").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        const hotAdvice = [
            "Hava çok sıcak, ince giyinmelisin.",
            "Güneş kremi sürmeyi unutma.",
            "Bol su içmeyi ihmal etme.",
            "Gölge yerlerde bulunmaya çalış.",
            "Şapka takmayı unutma.",
            "Açık renkli kıyafetler tercih et."
        ];

        const warmAdvice = [
            "Hava bugün sıcak, rahat kıyafetler giy.",
            "Güneş gözlüğü takabilirsin.",
            "Sık sık su içmeyi unutma.",
            "Serin yerlerde kalmaya çalış.",
            "Güneşten korunmak için şapka kullan.",
            "Yazlık kıyafetler giymeyi tercih et."
        ];

        const coldAdvice = [
            "Hava soğuk, kalın giyinmelisin.",
            "Atkı ve eldiven kullanmayı unutma.",
            "Sıcak içecekler tüket.",
            "Üşütmemek için kat kat giyin.",
            "Kabanını giymeyi ihmal etme.",
            "Kapalı alanlarda kalmaya çalış."
        ];

        const coolAdvice = [
            "Hava serin, mevsimlik kıyafetler giy.",
            "Hafif bir mont almayı unutma.",
            "Rüzgarlık kullanabilirsin.",
            "Şapka takmayı unutma.",
            "Açık havada vakit geçir.",
            "Ara ara sıcak içecekler tüket."
        ];

        const rainyAdvice = [
            "Yağmurlu hava, şemsiye almayı unutma.",
            "Su geçirmez kıyafetler giy.",
            "Ayakkabılarına dikkat et, kaymaz taban kullan.",
            "Dışarı çıkarken yağmurluk giymeyi ihmal etme.",
            "Kapüşonlu mont tercih et.",
            "Yanında ekstra bir çift çorap bulundur."
        ];

        const snowyAdvice = [
            "Kar yağışı var, kalın giyinmelisin.",
            "Botlarını giymeyi unutma.",
            "Atkı ve bere kullan.",
            "Eldivenlerini giymeyi ihmal etme.",
            "Kaygan yollarda dikkatli yürü.",
            "Sıcak bir içecek al."
        ];

        const getRandomAdvice = (adviceArray) => {
            return adviceArray[Math.floor(Math.random() * adviceArray.length)];
        };

        // Hava durumuna göre uyarı mesajları
        setTimeout(() => {
            if (temp >= 30) {
                alert(getRandomAdvice(hotAdvice));
            } else if (temp >= 25) {
                alert(getRandomAdvice(warmAdvice));
            } else if (temp <= 10) {
                alert(getRandomAdvice(coldAdvice));
            } else if (temp > 10 && temp < 25) {
                alert(getRandomAdvice(coolAdvice));
            }

            if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
                alert(getRandomAdvice(rainyAdvice));
            }

            if (id >= 600 && id <= 622) {
                alert(getRandomAdvice(snowyAdvice));
            }
        }, 3000); 

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
