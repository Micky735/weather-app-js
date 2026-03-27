document.getElementById('getWeather').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const container = document.getElementById('weatherContainer');

    if (!city) return alert("Per favore, inserisci una città");

    try {
        // 1. Trova le coordinate (Geocoding) [cite: 4]
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=it&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            container.innerHTML += `<p style="color:red;">Città "${city}" non trovata.</p>`; [cite: 16]
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // 2. Ottieni il meteo [cite: 5]
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;

        // 3. Mostra i risultati [cite: 6, 11]
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.innerHTML = `
            <h3>${name}</h3>
            <p>🌡️ Temperatura: ${current.temperature}°C</p>
            <p>💨 Vento: ${current.windspeed} km/h</p>
            <p>📝 Condizioni: ${interpretCode(current.weathercode)}</p>
        `;
        container.prepend(card); // Aggiunge in cima per vedere più città [cite: 30]

    } catch (error) {
        console.error("Errore:", error);
        alert("Si è verificato un errore nel recupero dei dati."); [cite: 27]
    }
});

// Funzione per tradurre i codici meteo [cite: 14]
function interpretCode(code) {
    if (code === 0) return "Sereno";
    if (code <= 3) return "Nuvoloso";
    return "Pioggia o altro";
}