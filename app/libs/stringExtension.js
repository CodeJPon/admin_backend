String.prototype.toLowerSnake = function () {
  try {
      return this.toString().replace(/[A-Z]/g, (letter, index) => {
          return index == 0 ? letter.toLowerCase() : '_' + letter.toLowerCase();
      });
  } catch (error) {
      console.error(error);
      return this.toString();
  }
};

String.prototype.toLowerCamel = function () {
  const str = this.toString();
  try {
      if (!(/[_-]/).test(str)) return str.substring(0, 1).toLowerCase() + str.substring(1, str.length);
      return str.toLowerCase().replace(/([-_][a-z])/g, group =>
          group
              .toUpperCase()
              .replace('-', '')
              .replace('_', '')
      );

  } catch (error) {
      console.error(error);
      return str;
  }
};
