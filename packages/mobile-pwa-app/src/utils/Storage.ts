let __SETTINGS_KEY__ = '@settings';

type StorageTypes = 'settings';

export class Storage {
  public static setItem(type: StorageTypes, value: { [key: string]: string }) {
    let _previousData = this.getItem(type) || {};
    switch (type) {
      case 'settings':
        localStorage.setItem(__SETTINGS_KEY__, JSON.stringify({ ..._previousData, ...value }));
        break;
    }
  }

  public static getItem(type: StorageTypes) {
    let result = null;
    switch (type) {
      case 'settings':
        result = localStorage.getItem(__SETTINGS_KEY__);
        break;
    }
    return result ? JSON.parse(result) : result;
  }
}
