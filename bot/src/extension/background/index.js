import SupremeBackground from './supreme/index';
import RestockMonitor from './supreme/RestockMonitor';

async function start() {
  const monitor = new RestockMonitor(10000);
  monitor.start();
  await SupremeBackground();
}
start();
