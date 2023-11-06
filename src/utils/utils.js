class UtilFuncs {
  getStorage = (key) => {
    return localStorage.getItem(key);
  };

  setStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  formatDate = (string) => {
    const d = new Date(string);
    const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
    const month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    return `${date}/${month}/${d.getFullYear()}`;
  };
}

export const utilFuncs = new UtilFuncs();
