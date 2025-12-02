const reverse = (string) => {
  return string.split("").reverse().join("");
};

const average = (array) => {
  const sum = array.reduce((sum, current) => sum + current, 0);
  return array.length === 0 ? 0 : sum / array.length;
};

export { reverse, average };
