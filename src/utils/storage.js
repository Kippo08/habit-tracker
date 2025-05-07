const USER_PREFIX = "habit-user-";
const CURRENT_USER = "habit-current-user";

export function getCurrentUser() {
  const username = localStorage.getItem(CURRENT_USER);
  return username ? { username } : null;
}

export function setCurrentUser(username) {
  localStorage.setItem(CURRENT_USER, username);
}

export function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER);
}

export function getUserData(username) {
  const data = localStorage.getItem(`${USER_PREFIX}${username}`);
  return data ? JSON.parse(data) : null;
}

export function setUserData(username, data) {
  localStorage.setItem(`${USER_PREFIX}${username}`, JSON.stringify(data));
}

export function getHabits(username) {
  const userData = getUserData(username);
  return userData?.habits || [];
}

export function setHabits(username, habits) {
  const userData = getUserData(username);
  if (userData) {
    userData.habits = habits;
    setUserData(username, userData);
  }
}
