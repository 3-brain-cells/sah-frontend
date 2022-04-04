import { API_ROOT } from "./newtypes/types";

export function getUserID(): string | null {
  // Check for the user ID in the local storage
  const userIDFromStorage = localStorage.getItem("user_id");
  console.log(`getUserID(): userIDFromStorage='${userIDFromStorage}'`);
  if (userIDFromStorage) {
    return userIDFromStorage;
  }

  return null;
}

export function redirectToLogin(args: Record<string, string>) {
  const query = Object.keys(args)
    .map((key) => `${key}=${args[key]}`)
    .join("&");
  const full_url = `${API_ROOT}/login?${query}`;
  console.log(`redirectToLogin(): full_url='${full_url}'`);
  window.location.href = full_url;
}

function onLoadCheck() {
  const userID = getUserIDFromQuery();
  console.log(`onLoadCheck(): userID='${userID}'`);
  if (userID !== null) {
    localStorage.setItem("user_id", userID);
  }

  // Clear the query path from the window URL
  window.history.replaceState({}, "", window.location.pathname);
}

onLoadCheck();

function getUserIDFromQuery(): string | null {
  // Check for the query argument with the user ID
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === "user_id") {
      return pair[1];
    }
  }

  return null;
}
