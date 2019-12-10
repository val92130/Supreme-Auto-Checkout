import StorageService from '../../services/StorageService';

export const OnSoldOutCartActions = {
  REMOVE_SOLD_OUT_PRODUCTS: 'REMOVE_SOLD_OUT_PRODUCTS',
  STOP: 'STOP',
};

function createDesktopAddressCookie(profile) {
  let str = null;
  switch (profile.order_billing_country) {
    case 'CANADA':
    case 'USA':
      str = `${profile.order_billing_name}|${profile.bo}|${profile.oba3 || ''}|${profile.order_billing_city}|${profile.order_billing_state || ''}|${profile.order_billing_zip}|${profile.order_billing_country}|${profile.order_email}|${profile.order_tel}`;
      break;
    case 'JAPAN':
      str = `${profile.order_billing_name}|${profile.bo}|${profile.order_billing_city}|${profile.order_billing_state || ''}|${profile.order_billing_zip}|${profile.order_email}|${profile.order_tel}`;
      break;
    default:
      str = `${profile.order_billing_name}|${profile.bo}|${profile.oba3 || ''}||${profile.order_billing_city}|${profile.order_billing_state || ''}|${profile.order_billing_zip}|${profile.order_billing_country}|${profile.order_email}|${profile.order_tel}`;
      break;
  }

  return {
    name: 'address',
    value: encodeURIComponent(str),
    url: 'https://www.supremenewyork.com',
  };
}

export async function updateSupremeCookies(profile) {
  console.log('Updating supreme address cookies');
  if (profile) {
    return StorageService.setCookie(createDesktopAddressCookie(profile));
  }

  console.warn('Couldnt update supreme cookies, profile isnt set');
  return null;
}
