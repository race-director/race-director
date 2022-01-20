/**
 *
 * @param length number - The length of the string to be generated
 * @param chars string - The characters to be used in the string. Default is alphanumeric (optional)
 * @returns string - The generated string
 *
 * @see https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
 */

const generateAlphanumericStr = (length: number, chars?: string) => {
  if (!chars)
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export default generateAlphanumericStr;
