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

// Endpoint to update an envelope and balances
app.put('/envelopes/:name', (req, res) => {
    const { name } = req.params;
    const { budget } = req.body;

    if (!envelopes[name]) {
        return res.status(404).send( {error: 'Envelope not found'});
    } else if (typeof budget !== 'number' || budget <= 0) {
        return res.status(400).send({ error: 'Invalid budget value' });
    } else {
        totalBudget += budget - envelopes[name];
        envelopes[name] = budget;
        res.send({ message: 'Envelope updated', envelopes });
    }
});

// Endpoint to delete an envelope
app.delete('/envelopes/:name', (req, res) => {
    const { name } = req.params;

    if (!envelopes[name]) {
        return res.status(404).send({ error: 'Envelope not found' });
    } else {
        totalBudget -= envelopes[name];
        delete envelopes[name];
        res.send({ message: 'Envelope deleted', envelopes });
    }
});

// Endpoint to move money between envelopes
app.post('/envelopes/transfer/:from/:to', (req, res) => {
    const { from, to } = req.params;
    const { amount } = req.body;

    if (!envelopes[from] || !envelopes[to]) {
        return res.status(404).send({ error: 'One or both envelopes not found' });
    } else if (typeof amount !== 'number' || amount <= 0 || amount > envelopes[from]) {
        return res.status(400).send({ error: 'Invalid transfer amount' });
    } else {
        envelopes[from] -= amount;
        envelopes[to] += amount;
        res.send({ message: 'Money moved', envelopes });
    }
});