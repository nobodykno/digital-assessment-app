export interface IWorkerScalingConfig {
    minReplicas: number;
    jobsPerWorker: number;
  }
  
  export const calculateDesiredReplicas = (
    queueSize: number,
    config: IWorkerScalingConfig,
  ): number => {
    if (queueSize <= 0) {
      return config.minReplicas;
    }
  
    const calculatedReplicas = Math.ceil(
      queueSize / config.jobsPerWorker,
    );
  
    return Math.max(
      config.minReplicas,
      calculatedReplicas,
    );
  };