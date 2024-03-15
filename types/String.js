export default {
  ucfirst(strVal) {
    if (typeof strVal !== 'string') throw "strVal must be a string";
    if (strVal === "") return "";

    let charFirst = strVal.substring(0, 1);
    charFirst = charFirst.toLocaleUpperCase();

    return charFirst+strVal.substring(1);
  }
}