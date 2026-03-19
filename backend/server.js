import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    message: 'Retail Shop Management API placeholder is running.',
    storageModes: ['localStorage', 'Firebase/Firestore', 'MongoDB via Node/Express']
  });
});

app.listen(port, () => {
  console.log(`Retail backend stub running on http://localhost:${port}`);
});
