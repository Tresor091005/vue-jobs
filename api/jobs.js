import { promises as fs } from 'fs';
import path from 'path';

const jobsFilePath = path.join(process.cwd(), 'data', 'jobs.json');
const idFilePath = path.join(process.cwd(), 'data', 'id.txt');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      const jobs = JSON.parse(await fs.readFile(jobsFilePath, 'utf8'));

      if (id) {
        // Afficher un blog spécifique par son id
        const job = jobs.find((job) => job.id === parseInt(id, 10));
        if (job) {
          res.status(200).json(job);
        } else {
          res.status(404).json({ message: 'Job not found' });
        }
      } else {
        // Afficher tous les blogs
        res.status(200).json(jobs);
      }
    } else if (req.method === 'POST') {
      // Lire les jobs existants
      const jobs = JSON.parse(await fs.readFile(jobsFilePath, 'utf8'));
      const newJob = req.body;

      // Lire et incrémenter le compteur d'ID
      let id = parseInt(await fs.readFile(idFilePath, 'utf8'), 10);
      newJob.id = id;
      id += 1;
      await fs.writeFile(idFilePath, id.toString());

      // Ajouter le nouveau job
      jobs.push(newJob);
      await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2));
      res.status(201).json(newJob);
    } else if (req.method === 'PUT') {
      // Mise à jour d'un blog par son id
      const { id } = req.query;
      const jobs = JSON.parse(await fs.readFile(jobsFilePath, 'utf8'));

      const jobIndex = jobs.findIndex((job) => job.id === parseInt(id, 10));
      if (jobIndex !== -1) {
        const updatedJob = { ...jobs[jobIndex], ...req.body };
        jobs[jobIndex] = updatedJob;

        await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2));
        res.status(200).json(updatedJob);
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } else if (req.method === 'DELETE') {
      // Suppression d'un blog par son id
      const { id } = req.query;
      const jobs = JSON.parse(await fs.readFile(jobsFilePath, 'utf8'));

      const filteredJobs = jobs.filter((job) => job.id !== parseInt(id, 10));
      if (filteredJobs.length !== jobs.length) {
        await fs.writeFile(jobsFilePath, JSON.stringify(filteredJobs, null, 2));
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
