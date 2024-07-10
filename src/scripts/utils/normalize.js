const normalize = (stringSalary) => {
  return +stringSalary.split(',').join('').slice(1);
};

export default normalize;
