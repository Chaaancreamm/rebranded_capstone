import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGeVx4ZmZPMXjeBR71lHbxVy8i-4gD9uQ",
    authDomain: "barangaybuddy.firebaseapp.com",
    databaseURL: "https://barangaybuddy-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "barangaybuddy",
    storageBucket: "barangaybuddy.appspot.com",
    messagingSenderId: "107104492368",
    appId: "1:107104492368:web:8896aec25ca1838cefaa55"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the 'Resident_Reports' node
const reportsRef = ref(database, 'Resident_Reports');

// Map of property names to their corresponding titles
const propertyTitles = {
  resCurLoc: 'Current Location',
  resName: 'Name of Resident',
  resReport: 'Report'
};


function displayReports() {
    onValue(reportsRef, (snapshot) => {
        const reportsTable = document.getElementById('reports');

        // Clear existing reports and headers
        reportsTable.innerHTML = '';

        // Check if snapshot exists and has data
        if (snapshot.exists() && snapshot.val()) {
            // Convert the snapshot to an object containing client IDs as keys
            const clientReports = snapshot.val();

            // Iterate over each client's reports
            Object.keys(clientReports).forEach((clientId, index) => {
                const client = clientReports[clientId];

                // Iterate over each report for the current client
                Object.keys(client).forEach((reportId, reportIndex) => {
                    const report = client[reportId];

                    // Format timestamp
                    const timestamp = new Date(report.timeStamp).toLocaleString();

                    // Add table headers before the first report
                    if (index === 0 && reportIndex === 0) {
                        const reportKeys = Object.keys(report).filter(key => key !== 'resId' && key !== 'timeStamp');
                        const tableHeaders = `
                            <tr>
                                ${reportKeys.map(key => `<th>${propertyTitles[key]}</th>`).join('')}
                                <th>Date and Time of Incident</th>
                            </tr>
                        `;
                        reportsTable.innerHTML += tableHeaders;
                    }

                    // Create table row for the report
                    const reportHtml = `
                        <tr>
                            ${Object.keys(report).filter(key => key !== 'resId' && key !== 'timeStamp').map(key => `<td>${report[key]}</td>`).join('')}
                            <td>${timestamp}</td>
                        </tr>
                    `;
                    reportsTable.innerHTML += reportHtml;
                });
            });
        } else {
            // Display a message if there are no reports
            reportsTable.innerHTML = '<tr><td colspan="4">No reports available</td></tr>';
        }
    });
}



// Execute the countReports and displayReports functions when the window is loaded
window.onload = function () {
    console.log('Window loaded');
    displayReports();
};
