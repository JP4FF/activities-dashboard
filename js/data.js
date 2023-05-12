'use strict';

async function getReportData() {
    return fetch('./data.json')
        .then((response) => response.json())
        .then((data) => data || [])
        .catch((error) => console.log(error));
}

const reportData = await getReportData();

export { reportData };
