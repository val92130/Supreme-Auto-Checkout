import SupremeExtension from './supreme/index';
import StorageService from '../../services/StorageService';


async function start() {
  const profile = await StorageService.getCurrentProfileSettings();
  const supremeExtension = new SupremeExtension();
  supremeExtension.start(profile);
}

start();
