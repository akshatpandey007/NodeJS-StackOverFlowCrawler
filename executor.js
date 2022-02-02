import loz from "./Logger.js";

export default class Executor {
  constructor({ maxConcurrentRequest = 5 }) {
    this.maxConcurrentRequest = maxConcurrentRequest;
    this.queue = []; //tasks
    this.concurrentRequests = 0;
    this.isRunning = true; // Executor Running Status
  }

  push(task) {
    this.queue.push(task);
  }

  startExecution() {
    loz("Executor Started with q size ", this.queue.length);
    this.processQueueTasks();
  }

  stopExecution() {
    loz("Executor Stopped with q size ", this.queue.length);
    this.isRunning = false;
  }

  async processQueueTasks() {
    if (!this.isRunning) return;

    if (
      this.concurrentRequests < this.maxConcurrentRequest &&
      this.queue.length > 0
    ) {
      const task = this.queue.shift();
      try {
        this.concurrentRequests++;
        await task();
      } catch (err) {
        loz("ERROR : ", "While executing task ->", err);
      } finally {
        this.concurrentRequests--;
      }
    }

    // rate limiting
    setTimeout(() => this.processQueueTasks(), 1000);
  }
}
