javascript
async function loadEphemerisFiles() {
    const response1 = await fetch('ephemeris/seas_18.se1');
    const data1 = await response1.text();

    const response2 = await fetch('ephemeris/seas_18.se2');
    const data2 = await response2.text();

    const response3 = await fetch('ephemeris/seas_18.se3');
    const data3 = await response3.text();
    
    return { data1, data2, data3 };
}

async function generateChart() {
    const { data1, data2, data3 } = await loadEphemerisFiles();
    
    const dob = document.getElementById('dob').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;

    // जन्म तिथि और समय को पार्स करें
    const birthDateTime = new Date(`${dob}T${time}`);

    // नटाल चार्ट और ट्रांजिट चार्ट की गणना करें
    const natalChart = calculateNatalChart(birthDateTime, location, data1, data2, data3);
    const transitChart = calculateTransitChart(natalChart, data1, data2, data3);

    // परिणाम को प्रदर्शित करें
    document.getElementById('chart-result').innerHTML = `
        <h2>नटाल चार्ट</h2>
        <pre>${JSON.stringify(natalChart, null, 2)}</pre>
        <h2>ट्रांजिट चार्ट</h2>
        <pre>${JSON.stringify(transitChart, null, 2)}</pre>
    `;
}

function calculateNatalChart(birthDateTime, location, data1, data2, data3) {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    const natalPositions = {};

    planets.forEach(planet => {
        const position = getPlanetPositionFromEphemeris(planet, data1);
        natalPositions[planet] = position;
    });

    return {
        type: "Natal Chart",
        date: birthDateTime,
        location: location,
        positions: natalPositions
    };
}

function getPlanetPositionFromEphemeris(planet, ephemerisData) {
    const lines = ephemerisData.split('\n');
    for (let line of lines) {
        const parts = line.split(/\s+/);
        if (parts[0] === planet) {
            return parseFloat(parts[1]); // ग्रह की डिग्री
        }
    }
    return null; // ग्रह नहीं मिला
}
