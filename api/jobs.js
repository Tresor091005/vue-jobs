let jobs = require('./data/jobs.json');
let idCounter = jobs.length ? Math.max(...jobs.map((job) => job.id)) + 1 : 1;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
        const job = jobs.find((job) => job.id === parseInt(id, 10));
        if (job) {
          res.status(200).json(job);
        } else {
          res.status(404).json({ message: 'Job not found' });
        }
      } else {
        res.status(200).json(jobs);
      }
    } else if (req.method === 'POST') {
      const newJob = { ...req.body, id: idCounter++ };
      jobs.push(newJob);
      res.status(201).json(newJob);
    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const jobIndex = jobs.findIndex((job) => job.id === parseInt(id, 10));
      if (jobIndex !== -1) {
        jobs[jobIndex] = { ...jobs[jobIndex], ...req.body };
        res.status(200).json(jobs[jobIndex]);
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const initialLength = jobs.length;
      jobs = jobs.filter((job) => job.id !== parseInt(id, 10));
      if (jobs.length < initialLength) {
        res.status(200).json({ message: `Job with id ${id} deleted` });
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
