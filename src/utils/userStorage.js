let getCurrentUser = () => null;

export function setGetCurrentUser(fn) {
  getCurrentUser = fn;
}

export function createUserStorage() {
  return {
    getItem: (name) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return null;
      const key = `${name}_${currentUser}`;
      const str = localStorage.getItem(key);
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      const key = `${name}_${currentUser}`;
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (name) => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;
      const key = `${name}_${currentUser}`;
      localStorage.removeItem(key);
    },
  };
}
