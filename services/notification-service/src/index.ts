import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
