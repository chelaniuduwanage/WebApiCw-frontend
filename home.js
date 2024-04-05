document.addEventListener('DOMContentLoaded', () => {
    const token = fetchLoginToken();
    if (!token) {
        console.error('Token not found. Please ensure you are logged in.');
        return;
    }

    const districts = document.querySelectorAll('path[name]');
    districts.forEach(district => {
        district.addEventListener('click', () => {
            const districtName = district.getAttribute('name');
            fetchDataAndDisplay(districtName, token, district);
        });
    });
});

function fetchLoginToken() {
    return localStorage.getItem('token');
}

function fetchDataAndDisplay(districtName, token, district) {
    const apiUrl = `https://jade-nice-deer.cyclic.app/wcast/getnonExpired?district=${districtName}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            const existingAlertBox = document.querySelector('.alert-box');
            if (existingAlertBox) {
                existingAlertBox.remove();
            }
            displayWeatherData(data, districtName, district);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayWeatherData(data, districtName, district) {
    const districtRect = district.getBoundingClientRect();

    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.style.position = 'absolute';
    alertBox.style.top = `${districtRect.top}px`;
    alertBox.style.left = `${districtRect.left + districtRect.width}px`; // Adjust position as needed

    const districtEntries = data.filter(entry => entry.districtName === districtName);

    if (districtEntries.length === 0) {
        alertBox.innerHTML = `<div>No data available for ${districtName}</div>`;
    } else {
        const environmentalConditions = districtEntries.map(entry => {
            return `
                <b>Temperature:</b> ${entry.temperature} C°<br>
                <b>Humidity:</b> ${entry.humidity} %<br>
                <b>Air Pressure:</b> ${entry.airPressure} mbar<br>
                <b>Last Update:</b> ${entry.dateTime}<br><br>
            `;
        }).join('');

        alertBox.innerHTML = `
            <div style="font-family: Arial, sans-serif;">
                <h2>${districtName}</h2>
                ${environmentalConditions}
            </div>
        `;
    }

    document.body.appendChild(alertBox);
}
