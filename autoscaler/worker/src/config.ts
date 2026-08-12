export interface IScalingConfig {
    queue: string;
    service: string;
    minReplicas: number;
    maxReplicas: number;
  }
  
  export const autoscalerConfig = {
    intervalMs: 10000,
  
    scaleDownCooldownMs: 60000,
  
    workers: {
        image: {
          minReplicas: 1,
          jobsPerWorker: 5,
        },
    
        video: {
          minReplicas: 2,
          jobsPerWorker: 2,
        },
      },
    
  } as const;