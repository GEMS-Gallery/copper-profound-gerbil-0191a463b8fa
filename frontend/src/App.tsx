import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { backend } from 'declarations/backend';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);

const App: React.FC = () => {
  const [word, setWord] = useState('');
  const [wordCloud, setWordCloud] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWordCloud();
  }, []);

  const fetchWordCloud = async () => {
    const cloud = await backend.getWordCloud();
    setWordCloud(cloud);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim()) {
      setLoading(true);
      await backend.addWord(word);
      setWord('');
      await fetchWordCloud();
      setLoading(false);
    }
  };

  const data = {
    datasets: [
      {
        data: wordCloud.map(([word, count]) => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          r: count * 5,
          word: word,
        })),
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderColor: 'rgba(52, 152, 219, 1)',
      },
    ],
  };

  const options = {
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw.word}: ${context.raw.r / 5}`,
        },
      },
    },
  };

  return (
    <Box className="min-h-screen flex flex-col items-center justify-center p-4">
      <Typography variant="h2" className="mb-8 text-secondary-main">
        Word Cloud Generator
      </Typography>
      <Box className="w-full max-w-3xl h-96 mb-8">
        <Scatter data={data} options={options} />
      </Box>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex gap-2">
        <TextField
          fullWidth
          variant="outlined"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Add'}
        </Button>
      </form>
    </Box>
  );
};

export default App;
