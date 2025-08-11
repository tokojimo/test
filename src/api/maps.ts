export type DownloadJob = {
  id: string;
  name: string;
  radiusKm: number;
  progress: number;
  status: 'queued' | 'downloading' | 'paused' | 'done' | 'error';
};

const jobs: DownloadJob[] = [];

export async function enqueue(job: Omit<DownloadJob, 'progress' | 'status'>): Promise<DownloadJob> {
  const j: DownloadJob = { ...job, progress: 0, status: 'queued' };
  jobs.push(j);
  return j;
}

export function listJobs(): Promise<DownloadJob[]> {
  return Promise.resolve(jobs);
}
