document.addEventListener('DOMContentLoaded', () => {
    const customToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkNoZWxhbmlpQGdtYWlsLmNvbSIsImlhdCI6MTcxMjI1NjI3NX0.ZVmiOpgcWah322BmVcwf1Jb7R5lyMHPhhDxfS7hbiwU';
    const districts = document.querySelectorAll('path[name]');
    const fetchDataAndUpdate = () => {
        districts.forEach(district => {
            const districtName = district.getAttribute('name');
            fetchData(districtName, customToken);
        });
    };

    // Refresh data every 10 seconds
    setInterval(fetchDataAndUpdate, 10000); // 10 seconds in milliseconds

    // Attach click event listeners to each district
    districts.forEach(district => {
        district.addEventListener('click', () => {
            const districtName = district.getAttribute('name');
            fetchDataAndDisplay(districtName, customToken, district);
        });
    });
});

function fetchData(districtName, customToken) {
    const apiUrl = `https://weatherapp-c9ig.onrender.com/wcast/getData?district=${districtName}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${customToken}`,
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
            // You can store the fetched data in a variable or process it further here
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchDataAndDisplay(districtName, customToken, district) {
    const apiUrl = `https://weatherapp-c9ig.onrender.com/wcast/getData?district=${districtName}`;

    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${customToken}`,
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
    alertBox.style.top = `${districtRect.top + window.scrollY}px`; // Adjust for page scroll
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
