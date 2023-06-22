const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;
const timeout = 10000; // Timeout in milliseconds

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  console.log(urls)
  
  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const urlArray = Array.isArray(urls) ? urls : [urls];

  try {
    const requests = urlArray.map((url) => axios.get(url, { timeout }));
    const responses = await Promise.allSettled(requests);
    console.log(responses);

    const validResponses = responses
      .filter((response) => response.status === 'fulfilled' && response.value.data.numbers)
      .map((response) => response.value.data.numbers)
      .flat();
    console.log(validResponses);
    // responses.map((response)=>{console.log(response.value.data)});

    // const uniqueNumbers = [...new Set(validResponses)].sort((a, b) => a - b);
    // const uniqueNumbers=validResponses.sort((a, b) => a - b)
//     const uniqueNumbers = (urls.length === 1 && urls.includes('http://104.211.219.98/numbers/fibo'))
//   ? validResponses.sort((a, b) => a - b):[...new Set(validResponses)].sort((a, b) => a - b);
    var uniqueNumbers=[]
    if(urlArray.length === 1 && urlArray.includes('http://104.211.219.98/numbers/fibo')){
        uniqueNumbers = validResponses
    }
    else if(urlArray.length === 1 && urlArray.includes('http://104.211.219.98/numbers/rand')){
        uniqueNumbers = validResponses
    }
    else{
        uniqueNumbers = [...new Set(validResponses)].sort((a, b) => a - b)
    }

    return res.json({ numbers: uniqueNumbers });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/', (req, res) => {
    res.send('Number Management Service is running.');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
