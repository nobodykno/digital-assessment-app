export interface IWorker {
    name: "image" | "video";
    queue: string;
    service: string;
    minReplicas: number;
    jobsPerWorker: number;
  }