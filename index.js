//globally accessed items/main components
let input = document.getElementById('city_input')
let city_date = document.getElementById('city_date')
let parent_discription = document.getElementById('parent_discription')
let today_img = document.getElementById('today_img')
let today_weather = document.getElementById('today_weather')
let temdiv = document.getElementById('temdiv')
let wind = document.getElementById('wind')
let humidity = document.getElementById('humidity')
let dropdown = document.getElementById('dropdown')
let full_data = document.getElementById('full_data')




//this is the function to open dropdown menu
function opener(event){
        if (event.target !== input) {
            console.log('here')
            dropdown.style.display = 'none'
            document.body.removeEventListener('click', opener)
        }
}
input.addEventListener('click', (event) => {
    // let dd = document.getElementById('dropdown')
    dropdown.style.display = 'block'
    event.stopPropagation();
    document.body.addEventListener('click', opener)
})





//fisrt thing i need the page to load is to load the weather of
// bangalore untill the user says otherwise
load('bangalore')




//when search button is clicked the weather load() is called
let search_btn = document.getElementById('search_btn')
search_btn.addEventListener('click', () => {
    // console.log('clicked', input.value)
    load(input.value.trim())
})






// ddd is short for dropdown data
//loading the dropdown for usersof us
if(localStorage.getItem('ddd')){
    let ddd_arr = localStorage.getItem('ddd').split('$')
    // console.log('spotted',ddd_arr)
    for(let city of ddd_arr){
        console.log('city=',city)
        if(city.length==0)continue
        let dd_el = document.createElement('div')
        dd_el.textContent = city
        dd_el.className = 'dd_city'
        dd_el.addEventListener('click',()=>{
            // input.value = city
            load(city)
            dropdown.style.display = 'none'
        })
        dropdown.appendChild(dd_el)
    }
}








//MAIN WEATHER FUNCTION 
async function load(city) {
    console.log('calledloadon',city)
    let data
    try {
        data = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + city + '?unitGroup=metric&key=WFGSEH2WJLBYYQVMDS6F47Q5M&contentType=json')
        data = await data.json()
    } catch (error) {
        // console.log('error=',error)
        alert('please check city name')
        return
    }
    // clearing the input 
    input.value = null


    let address_arr = data['resolvedAddress'].split(',')
    console.log('adderss=',address_arr)
    //getting the address and shortenenig it if needed for spcae reasons
    if(address_arr.length>2){
        let add = ''
        add+=address_arr[0]
        add+=address_arr[address_arr.length-1]
        city_date.textContent = add
    }
    else{
        city_date.textContent = data['resolvedAddress']
    }
    parent_discription.textContent = data['description']
    //updating the image for the weather form the api
    today_img.src = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/1st%20Set%20-%20Color/' + data['days'][0]['icon'] + '.svg'

    //updating the text below img(shortnenig it f needed)
    let now_weather_arr = data['days'][0]['icon'].split('-')
    console.log('kok',now_weather_arr)
    if(now_weather_arr.length>2){
        today_weather.textContent = now_weather_arr[0]+'-'+now_weather_arr[1]
    }
    else{
        today_weather.textContent = data['days'][0]['icon']
    }
    if(data['days'][0]['icon']=='rain'){
        today_weather.textContent = data['days'][0]['icon'] + ' ' + data['days'][0]['precipprob'] + '%'
    }

    //udating tmep and wind and humidity
    temdiv.textContent = 'Temp:' + data['days'][0]['temp'] + 'C'
    wind.textContent = 'Wind:' + data['days'][0]['windspeed'] + 'Kmph'
    humidity.textContent = 'Humidity:' + data['days'][0]['humidity'] + '%'


    //removing the existing future weather data
    let divToDelete = document.getElementById('parent_future');
    if (divToDelete) {
        divToDelete.remove();
    }


    //creating new future parent
    let parent = document.createElement('div')
    parent.id = 'parent_future'
    //creating the children
    for (let i = 1; i < 6; i++) {
        let div_fut_card = document.createElement('div')
        div_fut_card.className = 'fut_card'
        let date_div = document.createElement('div')
        date_div.textContent = data['days'][i]['datetime']
        let div_fut_img_cont = document.createElement('div')
        div_fut_img_cont.id = 'fut_img_cont'
        let fut_img = document.createElement('img')
        fut_img.className = 'fut_img'
        fut_img.src = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/1st%20Set%20-%20Color/' + data['days'][i]['icon'] + '.svg'
        let fut_weather = document.createElement('div')
        let icon_arr = data['days'][i]['icon'].split('-')
        // console.log('fata=',icon_arr)
        if(icon_arr.length>2){
            icon_arr.splice(2)
        }
        //updating all the values with the appropriate values form the api
        icon_arr = icon_arr.join('-')
        fut_weather.textContent = icon_arr
        let div_temp = document.createElement('div')
        div_temp.textContent = 'Temp:' + data['days'][i]['temp'] + 'C'
        let div_wind = document.createElement('div')
        div_wind.textContent = 'Wind:' + data['days'][i]['windspeed'] + 'Kmph'
        let div_humidity = document.createElement('div')
        div_humidity.textContent = 'Humidity:' + data['days'][i]['humidity'] + '%'
        // attaching the childern to parrent
        div_fut_img_cont.appendChild(fut_img)
        div_fut_img_cont.appendChild(fut_weather)
        div_fut_card.appendChild(date_div)
        div_fut_card.appendChild(div_fut_img_cont)
        div_fut_card.appendChild(div_temp)
        div_fut_card.appendChild(div_wind)
        div_fut_card.appendChild(div_humidity)
        parent.append(div_fut_card)
    }
    document.body.appendChild(parent)
    //connection complete

    //checking if they entered a new city and adding it accordingly
    let pre_ddd = localStorage.getItem('ddd') || ''
    // console.log('pre_ddd=',pre_ddd)
    if(!(pre_ddd.includes(city))){
        // console.log('not found in ddd')
        localStorage.setItem('ddd',pre_ddd+'$'+city)
        // localStorage.setItem('as','asd')
        let dd_el = document.createElement('div')
        dd_el.textContent = city
        dd_el.className = 'dd_city'
        dd_el.addEventListener('click',()=>{
            // console.log('niju')
            load(city)
            dropdown.style.display = 'none'
        })
        dropdown.appendChild(dd_el)
    }

    //full data redirect direct api full data 
    full_data.addEventListener('click',()=>{
        window.open('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + city + '?unitGroup=metric&key=WFGSEH2WJLBYYQVMDS6F47Q5M&contentType=json' ,'_blank')
    })

}



//getting your location button implementation
//yes i took cgpt's 'help' for this specific section
// but the code is not copied i fully understand the working

const useloc_btn = document.getElementById('useloc_btn')
function getLocation() {
    // Check if Geolocation is supported
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            try {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude

                const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                // console.log('url=',apiUrl)
                const response = await fetch(apiUrl)
                const data = await response.json()
                const city = data.locality
                //calling the weather load function
                load(city)
            } catch (error) {
                console.error('Error fetching location:', error)
                alert('Error fetching your location')
            }
        }, function(error) {
            alert('Please give location permission')
        })
    } else {
        alert('Geolocation is not supported by your browser')
    }
}
useloc_btn.addEventListener('click', getLocation)
