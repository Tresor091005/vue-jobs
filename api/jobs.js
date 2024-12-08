import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'jobs.json');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await fs.readFile(filePath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } else if (req.method === 'POST') {
      const jobs = JSON.parse(await fs.readFile(filePath, 'utf8'));
      const newJob = req.body;
      jobs.push(newJob);
      await fs.writeFile(filePath, JSON.stringify(jobs, null, 2));
      res.status(201).json(newJob);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
