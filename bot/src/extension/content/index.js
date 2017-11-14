import SupremeExtension from './supreme/index';
import AdidasExtension from './adidas/index';
import StorageService from '../../services/StorageService';


async function start() {
  const profile = await StorageService.getCurrentProfileSettings();
  const supremeExtension = new SupremeExtension();
  const adidasExtension = new AdidasExtension();
  switch (document.location.host.split('.')[1]) {
    case 'supremenewyork':
      supremeExtension.start(profile);
      break;
    case 'adidas':
      adidasExtension.start(profile);
      break;
  }
}

start();
