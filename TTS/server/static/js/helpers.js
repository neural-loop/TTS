const q = (selector) => document.querySelector(selector);

const getTextValue = (textId) => {
  const container = q(textId);
  if (container) {
    return container.value;
  }
  return "";
};

export default { q, getTextValue };