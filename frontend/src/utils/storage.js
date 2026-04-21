const KEY = "create_apartment_draft";

export const saveDraft = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const getDraft = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const clearDraft = () => {
  localStorage.removeItem(KEY);
};