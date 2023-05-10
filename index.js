const express = require('express');
const openai = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const password = process.env.PASSWORD;
const openaiAPIKey = process.env.OPENAI_API_KEY;

const apiVersion = '2020-05-15';
const models = {
  davinci: {
    id: 'davinci',
    name: 'Davinci',
    description: 'Powerful AI model for generating human-like text.'
  },
  curie: {
    id: 'curie',
    name: 'Curie',
    description: 'A smaller and faster version of Davinci, but less accurate.'
  },
  babbage: {
    id: 'babbage',
    name: 'Babbage',
    description: 'A smaller and faster version of Curie.'
  },
  ada: {
    id: 'ada',
    name: 'Ada',
    description: 'A smaller and faster version of Babbage.'
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/generate-text', (req, res) => {
  const { model, prompt, length, temperature } = req.body;
  const selectedModel = models[model];

  if (!selectedModel) {
    res.status(400).send('Invalid model.');
  }

  if (!req.headers.authorization || req.headers.authorization !== password) {
    res.status(401).send('Unauthorized access.');
    return;
  }

  openai.apiKey = openaiAPIKey;

  const params = {
    engine: selectedModel.id,
    prompt: prompt,
    max_tokens: parseInt(length),
    temperature: parseFloat(temperature)
  };

  openai.complete(params).then(completion => {
    const { choices } = completion.data;
    const [{ text }] = choices;

    res.json({ text });
  }).catch(err => {
    console.error(err);
    res.status(500).send('Error generating text.');
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
