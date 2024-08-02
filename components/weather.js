import {
    View, Text, Alert, ActivityIndicator, RefreshControl,
    ScrollView, SafeAreaView, StyleSheet, Image, Dimensions, FlatList
} from 'react-native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';

const openWeatherKey = 'adc2ee36f5a0cca64a41ea2484f2463e';

const Weather = () => {
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefresh] = useState(false);

    const loadForecast = async () => {
        setRefresh(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            setRefresh(false);
            return;
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${openWeatherKey}`);

        const data = await response.json();

        if (!response.ok) {
            console.log(data);
            Alert.alert('Error', 'Something went wrong');
            setRefresh(false);
        } else {
            setForecast(data);
        }
        setRefresh(false);
    };

    useEffect(() => {
        loadForecast();
    }, []);

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    // Accessing the current weather description and temperature
    const weatherDescription = forecast.weather[0].description;
    const icon = forecast.weather[0].icon; // Get the weather icon code
    const temperature = (forecast.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius

    return (
        <SafeAreaView style={styles.Backgroud}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadForecast} />
                }
                style={{ marginTop: 50 }}
            >
                <Text style={styles.title}>
                    current weather forecast
                </Text>
                <Text style={{ textAlign: "center" }}>
                    Your Location
                </Text>
                <View style={styles.current}>
                    <Image style={styles.largeIcon}
                        source={{
                            uri: `https://openweathermap.org/img/wn/${icon}@4x.png`
                        }}
                    />
                    <Text style={styles.currentTemprate}>{temperature}°C</Text>
                </View>
                <Text style={styles.weatherDiscription}>
                    {weatherDescription}
                </Text>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <View>
                            <Image source={require('../assets/temp.png')}
                                style={styles.tempIcon}
                            />
                            <Text style={styles.feelslikeText}>
                                {forecast.main.feels_like} C
                            </Text>
                            <Text style={styles.feelslikeText}>
                                Feels Like
                            </Text>
                        </View>
                    </View>
                    <View style={styles.info}>
                        <View>
                            <Image source={require('../assets/humidity.png')}
                                style={styles.humidityIcon}
                            />
                            <Text style={styles.humidityText}>
                                {forecast.main.humidity}%
                            </Text>
                            <Text style={styles.humidityText}>
                                Humidity
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.hourlyText}>
                    <Text style={styles.hourlyTextDetail}>
                        Next Hours
                    </Text>
                    <FlatList
                        horizontal
                        data={forecast.hourly}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={
                            (hour) => {
                                const weather = hour.item.weather[0];
                                var dt = new Date(hour.item.dt * 1000);
                                return (
                                    <View>
                                        <Text style={styles.hourlyTextDetail}>
                                            {dt.toLocaleTimeString()}
                                        </Text>
                                    </View>
                                )
                            }
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Weather;

const styles = StyleSheet.create({
    Backgroud: {
        backgroundColor: "#c4e0f0",
        flex: 1,
    },
    // container: {
    //     flex: 1,
    //     color: "#7474b7"
    // },
    title: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: 'bold',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
    },
    current: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    largeIcon: {
        width: 200,
        height: 250,
    }, currentTemprate: {
        textAlign: 'center',
        fontSize: 16,
        color: "#030245",
        fontWeight: "bold"
    }, weatherDiscription: {
        fontSize: 20,
        alignItems: "center",
        textAlign: "center"
    }, tempIcon: {
        padding: 10,
        width: 60,
        height: 60,
        marginLeft: 50,
        borderRadius: 50 / 2
    }, extraInfo: {
        marginTop: 20,
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: "row"
    }, feelslikeText: {
        fontSize: 15,
        color: "#fafdff",
        padding: 2,
        textAlign: "center"
    }, humidityIcon: {
        padding: 10,
        width: 80,
        height: 80,
        marginLeft: 50,
        borderRadius: 50 / 2,
    }, humidityText: {
        fontSize: 15,
        color: "#fafdff",
        padding: 2,
        textAlign: "center"
    }, info: {
        width: Dimensions.get('screen').width / 2.5,
        backgroundColor: "#030245",
        justifyContent: 'center',
        borderRadius: 15,
    }, hourlyTextDetail: {
        fontSize: 20,
        // color: "",
        padding: 2,
        textAlign: "center"
    }
});
