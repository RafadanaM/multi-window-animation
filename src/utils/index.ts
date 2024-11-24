const LS_KEY = "windowsData";

type TWindowData = {
  x: number;
  y: number;
};

type TWindowsData = Record<string, TWindowData>;

export function getWindowsData() {
  const windowsData = localStorage.getItem(LS_KEY);

  if (!windowsData) return null;

  return JSON.parse(windowsData) as TWindowsData;
}

export function getWindowData(id: string) {
  const data = getWindowsData();

  if (!data) return null;

  return data[id] ?? null;
}

export function setWindowData(id: string, data: TWindowData) {
  const windowsData = getWindowsData();

  if (!windowsData) {
    localStorage.setItem(LS_KEY, JSON.stringify({ [id]: data }));
    return;
  }

  windowsData[id] = data;
  localStorage.setItem(LS_KEY, JSON.stringify(windowsData));
}

export function deleteWindowData(id: string) {
  const data = getWindowsData();

  if (!data) return;
  delete data[id];
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export function clearWindowData() {
  localStorage.removeItem(LS_KEY);
}
