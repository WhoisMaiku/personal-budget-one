const app = require('express')();
const bodyParser = require('body-parser');
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Global variables to store total budget and envelopes
let totalBudget = 0;
let envelopes = {};

// Endpoint to create a new budget envelope
app.post('/envelopes', (req, res) => {
  const { name, budget } = req.body;

  if (!name || typeof budget !== 'number' || budget <= 0) {
    return res.status(400).send({ error: 'Invalid envelope data' });
  }

  if (envelopes[name]) {
    return res.status(400).send({ error: 'Envelope already exists' });
  }

  envelopes[name] = budget;
  totalBudget += budget;

  res.status(201).send({ message: 'Envelope created', envelopes });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Endpoint to retrieve all envelopes
app.get('/envelopes', (req, res) => {
    // Check if there are any envelopes
    if (Object.keys(envelopes).length === 0) {
        return res.status(404).send({ error: 'No envelopes found' });
    }
    else {
        res.send({ envelopes });
    }
});

// Endpoint to retrieve a specific envelope
app.get('/envelopes/:name', (req, res) => {
    const { name } = req.params;

    // Check if the envelope exists
    if (!envelopes[name]) {
        return res.status(404).send({ error: 'Envelope not found' });
    }
    else {
        res.send({ name, budget: envelopes[name] });
    }
});
