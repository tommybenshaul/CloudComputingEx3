const fs = require('fs');
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const ENDPOINT = '/dishes';
const QUERY_FILE = '.github/ci-resources/query.txt';
const RESPONSE_FILE = '.github/ci-resources/response.txt';

async function readQueriesFromFile() {
    return fs.promises.readFile(QUERY_FILE, 'utf-8')
        .then(data => data.split('\n').filter(Boolean));
}

async function writeToFile(message) {
    return fs.promises.appendFile(RESPONSE_FILE, message);
}

function makePostRequest(food) {
    return axios.post(`${BASE_URL}${ENDPOINT}`, { name: food })
        .catch(err => {
            const errorMessage = `Failed to POST ${food} to ${err.config.url}. Status code: ${err.response.status}. Message: ${err.message}\n`;
            console.error(errorMessage);
            return writeToFile(errorMessage);
        });
}

function makeGetRequest(food) {
    return axios.get(`${BASE_URL}${ENDPOINT}/${food}`)
        .catch(err => {
            const errorMessage = `Failed to GET ${food} from ${err.config.url}. Status code: ${err.response.status}. Message: ${err.message}\n`;
            console.error(errorMessage);
            return writeToFile(errorMessage);
        });
}

async function queryService() {
    const queries = await readQueriesFromFile();
    await fs.promises.writeFile(RESPONSE_FILE, '');  // Always create the response.txt file

    for (const food of queries) {
        const postResponse = await makePostRequest(food);
        if(postResponse) {
            const getResponse = await makeGetRequest(food);
            if (getResponse) {
                const { cal, sodium, sugar } = getResponse.data;
                await writeToFile(`${food} contains ${cal} calories, ${sodium} mgs of sodium, and ${sugar} grams of sugar\n`);
            }
        }
    }
}

queryService();
