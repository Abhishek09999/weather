import getWeather from "../API/WeatherApi";
import WeatherRow from "../components/WeatherRow";
import WeatherSummary from "../components/WeatherSummary";
import {useEffect,useState} from "react"
const fetchCoordinate=(callback)=>{
    navigator.geolocation.getCurrentPosition(
        ({coords:{latitude,longitude}})=>{
            callback(latitude,longitude)
        },
        (err)=>console.error(err)
    );
};
const WeatherPages=()=> {
    const[todayWeather,setTodayWeather]=useState({});
    const[weekWeather,setWeekWeather]=useState([]);
    const[isCelsius,setIsCelsius]=useState(true);
    const isDay=todayWeather.isDay ?? true;
    useEffect(()=>{
        fetchCoordinate(async(latitude,longitude)=>{
           const weatherInfo = await getWeather({latitude,longitude});
          covertToStateVariable(weatherInfo);
        })
    },[])
    const covertToStateVariable=(tempWeekWeather)=>{
      let fetchWeatherInfo=[];
      for(let i=0;i< tempWeekWeather.daily.time.length;i++){
        fetchWeatherInfo.push({
            date:new Date(tempWeekWeather.daily.time[i]),
            maxTemperature: tempWeekWeather.daily.temperature_2m_max[i],
            minTemperature: tempWeekWeather.daily.temperature_2m_min[i],
            weatherCode: tempWeekWeather.daily.weathercode[i],
        })
      }
      setWeekWeather(fetchWeatherInfo);
      let currentWeather=tempWeekWeather.current_weather;
      currentWeather.time=new Date(currentWeather.time);
      currentWeather.isDay=currentWeather.is_day === 1 ? true : false;
      delete currentWeather.is_day;
      currentWeather.weatherCode=currentWeather.weathercode;
      delete currentWeather.weathercode;
      setTodayWeather(currentWeather);
    }
    return (
    <div className={isDay ?"app" :"app dark"}>
        <h1 className="my-heading">Weather </h1>
        <button className="ui icon button"
        onClick={()=>{
            setIsCelsius(!isCelsius);
        }} style={{float: "right"}}>{isCelsius ? "ºF" : "ºC"}</button>
        <div>
            <WeatherSummary currentWeather={todayWeather} isCelsius={isCelsius}/>
            <table className="ui very basic table" style={!isDay ? {backgroundColor : "black", color:"white"}:{}}>
                <thead className="table-custom" style={!isDay ? {backgroundColor : "black", color:"white"}:{}}>
                <tr>
                    <th>Date</th>
                    <th>Temperature</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody className="table-custom">
                    {weekWeather.map((weather) => (
                        <WeatherRow 
                        weather={weather} 
                        isCelsius={isCelsius} 
                        key={weather.Date}
                        />
                        ))}

                </tbody>
            </table>
        </div>
        </div>
    )
}
export default WeatherPages;