import Docker from "dockerode";

import rabbitmq from "@dam/shared/rabbitmq";

import { autoscalerConfig } from "./config.js";

import { getQueueSize } from "./rabbitmq.js";

import { calculateDesiredReplicas } from "./scaler.js";
import { IWorker } from "./dto/worker-dto.js";

const docker = new Docker({
  socketPath: "/var/run/docker.sock",
});

const lastScaleDown: Record<string, number> = {};



const workers: IWorker[] = [
  {
    name: "image",
    queue: rabbitmq.rabbitMQQueues.image,
    service: "dam_image-worker",
    minReplicas:
      autoscalerConfig.workers.image.minReplicas,
    jobsPerWorker:
      autoscalerConfig.workers.image.jobsPerWorker,
  },
  {
    name: "video",
    queue: rabbitmq.rabbitMQQueues.video,
    service: "dam_video-worker",
    minReplicas:
      autoscalerConfig.workers.video.minReplicas,
    jobsPerWorker:
      autoscalerConfig.workers.video.jobsPerWorker,
  },
];

const getCurrentReplicas = async (
  serviceName: string,
): Promise<number> => {
  const service =
    docker.getService(serviceName);

  const serviceInfo =
    await service.inspect();

  return (
    serviceInfo.Spec.Mode?.Replicated
      ?.Replicas ?? 0
  );
};

const scaleService = async (
  serviceName: string,
  desiredReplicas: number,
): Promise<void> => {
  const service =
    docker.getService(serviceName);

  const serviceInfo =
    await service.inspect();

  const currentReplicas =
    serviceInfo.Spec.Mode?.Replicated
      ?.Replicas ?? 0;

  if (currentReplicas === desiredReplicas) {
    console.log(
      `${serviceName} already has ${currentReplicas} replicas`,
    );

    return;
  }

  await service.update({
    ...serviceInfo.Spec,
    Mode: {
      Replicated: {
        Replicas: desiredReplicas,
      },
    },
  });

  console.log(
    `{serviceName}: ${currentReplicas} → ${desiredReplicas}`,
  );
};

const scaleWorker = async (
  worker: IWorker,
): Promise<void> => {
  const queueSize =
    await getQueueSize(worker.queue);

  const desiredReplicas =
    calculateDesiredReplicas(
      queueSize,
      {
        minReplicas:
          worker.minReplicas,

        jobsPerWorker:
          worker.jobsPerWorker,
      },
    );



  /*
   * Compose testing mode.
   *
   * Read the queue and calculate the desired
   * number of workers, but don't access
   * Docker Swarm services.
   */

  const currentReplicas =
    await getCurrentReplicas(
      worker.service,
    );

  console.log(
    `[${worker.name}] Queue=${queueSize} Current=${currentReplicas} Desired=${desiredReplicas}`,
  );

  /*
   * Scale UP immediately
   */
  if (desiredReplicas > currentReplicas) {
    console.log(
      `⬆️ Scaling UP ${worker.service}`,
    );

    await scaleService(
      worker.service,
      desiredReplicas,
    );

    return;
  }

  /*
   * Scale DOWN with cooldown
   */
  if (desiredReplicas < currentReplicas) {
    const now = Date.now();

    const lastScale =
      lastScaleDown[worker.service] ?? 0;

    const cooldownPassed =
      now -
        lastScale >=
      autoscalerConfig.scaleDownCooldownMs;

    if (!cooldownPassed) {
      console.log(
        `Scale-down cooldown active for ${worker.service}`,
      );

      return;
    }

    console.log(
      `⬇️ Scaling DOWN ${worker.service}`,
    );

    await scaleService(
      worker.service,
      desiredReplicas,
    );

    lastScaleDown[worker.service] =
      now;
  }
};


const runAutoscaler = async (): Promise<void> => {
  console.log(
    "Checking worker queues...",
  );

  for (const worker of workers) {
    try {
      await scaleWorker(worker);
    } catch (error) {
      console.error(
        `Failed to scale ${worker.service}`,
        error,
      );
    }
  }
};

const start = async (): Promise<void> => {
  await runAutoscaler();

  setInterval(
    runAutoscaler,
    autoscalerConfig.intervalMs,
  );
};

start().catch((error) => {
  console.error(
    "Autoscaler failed to start",
    error,
  );

  process.exit(1);
});