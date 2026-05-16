import cron from 'node-cron';
import Job from '../models/Job.js';
import { notifyUser } from '../modules/notifications/notification.service.js';

const closeExpiredJobs = async () => {
  const now = new Date();
  const expired = await Job.find({
    status: 'open',
    applicationDeadline: { $ne: null, $lt: now },
  }).select('_id title client applicationDeadline');

  if (expired.length === 0) {
    return { closed: 0 };
  }

  const ids = expired.map((j) => j._id);
  await Job.updateMany(
    { _id: { $in: ids } },
    { $set: { status: 'closed', closedAt: now, closedReason: 'deadline_expired' } }
  );

  await Promise.allSettled(
    expired.map((job) =>
      notifyUser(job.client, {
        type: 'JOB_AUTO_CLOSED',
        title: 'Job Auto-Closed',
        message: `Your job "${job.title}" was auto-closed because the application deadline passed.`,
        link: `/jobs/${job._id}`,
        data: { jobId: job._id.toString(), reason: 'deadline_expired' },
      })
    )
  );

  console.log(`[Cron] Auto-closed ${expired.length} expired job(s)`);
  return { closed: expired.length };
};

export const startCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      await closeExpiredJobs();
    } catch (err) {
      console.error('[Cron] closeExpiredJobs error', err);
    }
  });

  console.log('[Cron] Scheduled jobs started');
};

export { closeExpiredJobs };
