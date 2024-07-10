const salarize = (string) => {
  return '$' + (+string).toLocaleString('en-US');
};

export default salarize;
