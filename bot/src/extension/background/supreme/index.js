import * as menus from '../../../app/constants/Menus';
import * as Helpers from '../../../app/utils/Helpers';
import StorageService from '../../../services/StorageService';
import AtcService from '../../../services/supreme/AtcService';


async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function timeout(ms, callback) {
  await sleep(ms);
  callback();
}

async function getSettings() {
  try {
    const profile = await StorageService.getCurrentProfileSettings();
    return profile.Supreme;
  } catch(e) {
    console.info('Error while getting settings');
    console.info(e);
    return null;
  }
}

async function processByMonitor() {
  await AtcService.runAllMonitor();
}

function isEnabled(settings) {
  return settings && settings[menus.MENU_OPTIONS] && settings[menus.MENU_OPTIONS].atcEnabled;
}

function getAtcStartTime(settings) {
  if (!settings || !settings[menus.MENU_OPTIONS]) {
    return null;
  }
  const atcStartTime = settings[menus.MENU_OPTIONS].atcStartTime;
  const atcStartDate = settings[menus.MENU_OPTIONS].atcStartDate;
  if (!atcStartTime || !atcStartDate) {
    return null;
  }
  const time = Helpers.timeToDate(atcStartTime);
  const currDate = new Date(atcStartDate);
  currDate.setHours(time.getHours());
  currDate.setMinutes(time.getMinutes());
  currDate.setSeconds(time.getSeconds());
  return currDate;
}

async function loop() {
  const settings = await getSettings();
  if (!isEnabled(settings)) {
    await timeout(1000, () => loop());
    return;
  }
  const now = new Date();
  const startTime = getAtcStartTime(settings);
  if (!startTime || !Helpers.sameDay(now, startTime)) {
    await timeout(1000, () => loop());
    return;
  }
  const diffTime = (startTime.getTime() - now.getTime()) / 1000;
  console.log(`ATC starting in ${diffTime} seconds...`);

  if (diffTime <= 0 && Math.abs(diffTime) < 3) {
    if (settings.Options.atcUseMonitor) {
      await processByMonitor();
    } else {
      await AtcService.runAll();
    }
    await timeout(4000, () => loop());
    return;
  }
  await timeout(1000, () => loop());
}


export default async function start() {
  await loop();
}
