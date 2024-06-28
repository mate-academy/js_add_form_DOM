function convertSalaryToString(value) {
  const res = String(value).split('');
  let currGroup = 1;

  for (let i = res.length - 1; i > 0; i--) {
    if (currGroup === 3) {
      currGroup = 1;
      res[i] = ',' + res[i];
      continue;
    }
    currGroup++;
  }

  return '$' + res.join('');
}

export const utils = {
  convertSalaryToString,
};
