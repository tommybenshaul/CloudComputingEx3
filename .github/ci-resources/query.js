const fs = require('fs');
const axios = require('axios');

async function queryService() {
    const queries = fs.readFileSync('.github/ci-resources/query.txt', 'utf-8').split('\n').filter(Boolean);

    for (const food of queries) {
        try {
            await axios.post('http://localhost:8000/dishes', { name: food });
        } catch (err) {
            console.error(`Failed to POST ${food}: ${err.message}`);
        }

        try {
            const response = await axios.get(`http://localhost:8000/dishes/${food}`);
            const { cal, sodium, sugar } = response.data;
            fs.appendFileSync('response.txt', `${food} contains ${cal} calories, ${sodium} mgs of sodium, and ${sugar} grams of sugar\n`);
        } catch (err) {
            console.error(`Failed to GET ${food}: ${err.message}`);
        }
    }
}

queryService();
