// this function can be fed params from the param form to return the desired random number based on digits. (easy mode: single digit, medium: two digits, hard: three digits)
function getNumber(x) {
  const min = Math.pow(10, x - 1);
  const max = Math.pow(10, x) - 1;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
  // // Example usage: generate a 4-digit random number
  // getNumber(4);
  //
}
