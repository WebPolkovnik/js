export default class DateTime {
  objDateTime = new DateTimeBase();

  constructor() {}

  getDate() { return this.objDateTime.intDate; }
  setDate(intVal) {
    if (typeof intVal !== "number") throw "intVal must be a number";
    if (intVal < 1 || intVal > this.objDateTime.intLastDate) throw "intVal must >= 1 and <= "+this.objDateTime.intLastDate;
    this.objDateTime.intDate = intVal;
    this.objDateTime._updateDateTimeData();
  }

  getMonth() { return this.objDateTime.intMonth; }
  setMonth(intVal) {
    if (typeof intVal !== "number") throw "intVal must be a number";
    if (intVal < 1 || intVal > 12) throw "intVal must >= 1 and <= 12";
    this.objDateTime.intMonth = intVal;
    this.objDateTime._updateMaxDate();
    this.objDateTime._updateDateTimeData();
  }

  getYear() { return this.objDateTime.intYear; }
  setYear(intVal) {
    if (typeof intVal !== "number") throw "intVal must be a number";
    if (intVal < 1970) throw "intVal must >= 1970";
    this.objDateTime.intYear = intVal;
    this.objDateTime._updateDateTimeData();
  }

  getHours() { return this.objDateTime.intHours; }
  setHours(intVal) {
    if (typeof intVal !== "number") throw "intVal must be a number";
    if (intVal < 0 || intVal > 23) throw "intVal must >= 0 and <= 23";
    this.objDateTime.intHours = intVal;
    this.objDateTime._updateDateTimeData();
  }

  getMinutes() { return this.objDateTime.intMinutes; }
  setMinutes(intVal) {
    if (typeof intVal !== "number") throw "intVal must be a number";
    if (intVal < 0 || intVal > 59) throw "intVal must >= 0 and <= 59";
    this.objDateTime.intMinutes = intVal;
    this.objDateTime._updateDateTimeData();
  }

  getSeconds() { return this.objDateTime.intSeconds; }
  setSeconds(intVal) {
    if (typeof intVal !== "number") throw "intVal must be a number";
    if (intVal < 0 || intVal > 59) throw "intVal must >= 0 and <= 59";
    this.objDateTime.intSeconds = intVal;
    this.objDateTime._updateDateTimeData();
  }
  getTimestamp() { return this.objDateTime.intTimestamp; }
  getLastDate() { return this.objDateTime.intLastDate; }
  getDay() { return this.objDateTime.intDay; }

  modify(intVal, strOperand) { this.objDateTime.modify(intVal, strOperand); }
}

class DateTimeBase {
  intDate     = 1
  intMonth    = 1
  intYear     = 1
  intHours    = 0
  intMinutes  = 0
  intSeconds  = 0
  intLastDate  = 0
  intTimestamp= 0
  intDay      = 0;

  constructor() {
    let objDateTimeNow = new Date();
    this.intDate = objDateTimeNow.getDate();
    this.intMonth = objDateTimeNow.getMonth() + 1;
    this.intYear = objDateTimeNow.getFullYear();
    this.intHours = objDateTimeNow.getHours();
    this.intMinutes = objDateTimeNow.getMinutes();
    this.intSeconds = objDateTimeNow.getSeconds();
    this.intTimestamp = objDateTimeNow.getTime();
    this._updateMaxDate();
  }

  _updateDateTimeData() {
    let objDateTime = new Date(
      this.intYear, this.intMonth, this.intDate, this.intHours, this.intMinutes, this.intSeconds
    );
    this.intTimestamp = objDateTime.getTime() / 1000;
    this.intDay = objDateTime.getDay();
  }
  _updateMaxDate() { this.intLastDate = (new Date(this.intYear, this.intMonth, 0)).getDate(); }
  _nextYear() {
    this.intYear++;
    this._updateDateTimeData();
  }
  _prevYear() {
    this.intYear--;
    this._updateDateTimeData();
  }
  _nextMonth() {
    if (this.intMonth >= 12) {
      this._nextYear();
      this.intMonth = 0;
    }
    this.intMonth++;
    this._updateMaxDate();
    this._updateDateTimeData();
  }
  _prevMonth() {
    if (this.intMonth === 1) {
      this._prevYear();
      this.intMonth = 13;
    }
    this.intMonth--;
    this._updateMaxDate();
    this._updateDateTimeData();
  }
  _nextDate() {
    let intCurrentDate = this.intDate;
    if (intCurrentDate >= this.intLastDate) {
      this._nextMonth();
      this.intDate = 0;
    }
    this.intDate++;
    this._updateDateTimeData();
  }
  _prevDate() {
    if (this.intDate === 1) {
      this._prevMonth();
      this._updateMaxDate();
      this.intDate = this.intLastDate + 1;
    }
    this.intDate--;
    this._updateDateTimeData();
  }
  _nextHours() {
    if (this.intHours >= 23) {
      this._nextDate();
      this.intHours = -1;
    }
    this.intHours++;
    this._updateDateTimeData();
  }
  _prevHours() {
    if (this.intHours <= 0) {
      this._prevDate();
      this.intHours = 24;
    }
    this.intHours--;
    this._updateDateTimeData();
  }
  _nextMinutes() {
    if (this.intMinutes >= 59) {
      this._nextHours();
      this.intMinutes = -1;
    }
    this.intMinutes++;
    this._updateDateTimeData();
  }
  _prevMinutes() {
    if (this.intMinutes <= 0) {
      this._prevHours();
      this.intMinutes = 60;
    }
    this.intMinutes--;
    this._updateDateTimeData();
  }
  _nextSeconds() {
    if (this.intSeconds >= 59) {
      this._nextMinutes();
      this.intSeconds = -1;
    }
    this.intSeconds++;
    this._updateDateTimeData();
  }
  _prevSeconds() {
    if (this.intSeconds <= 0) {
      this._prevMinutes();
      this.intSeconds = 60;
    }
    this.intSeconds--;
    this._updateDateTimeData();
  }

  modify(intVal, strOperand) {
    if (typeof intVal !== 'number')  throw "value is not number";
    if (typeof strOperand !== 'string') throw "operand is not string";
    if (intVal === 0) throw "value required > 0 or < 0"

    let boolIsNext = intVal > 0;
    intVal = Math.abs(intVal);
    let charFirst = strOperand.substring(0, 1);
    charFirst = charFirst.toLocaleUpperCase();
    strOperand = charFirst+strOperand.substring(1);

    switch (strOperand) {
      case "Date":
      case "Month":
      case "Year":
      case "Hours":
      case "Minutes":
      case "Seconds":
        for (let i = 0; i < intVal; i++)
          if (boolIsNext) this["_next"+strOperand](); else this["_prev"+strOperand]();
        break;

      default: throw "operand: date, month, year, hours, minutes, seconds"
    }
  }

  getInFormat() {
    // let objDateNow = new Date();
    // let monthsDeclinations = [
    //   "января",
    //   "февраля",
    //   "марта",
    //   "апреля",
    //   "мая",
    //   "июня",
    //   "июля",
    //   "августа",
    //   "сентября",
    //   "октября",
    //   "ноября",
    //   "декабря"
    // ];
    // let strFormat = this.getDate();
    // if (objDateNow.getFullYear() === this.getYear()) {
    //   if (objDateNow.getMonth() === this.getMonth()) {
    //     if (objDateNow.getDate() === this.getDate()) {
    //       strFormat = "сегодня"
    //     }
    //   }
    // }
    // strFormat += " ";
    // strFormat += monthsDeclinations[this.getMonth()];
    // if (objDateNow.getFullYear() !== this.getFullYear()) {
    //   strFormat += this.getFullYear();
    // }
    //
    // return strFormat;
  }
}