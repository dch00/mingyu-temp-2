import { format } from "date-fns-tz";

function toArray(availability) {
  return availability.split("");
}

function toString(availability) {
  return availability.join("");
}

function convertTimezone(toUtc, availability) {
  if (typeof availability === "string") availability = toArray(availability);
  let converted = new Array(availability.length).fill("0");
  for (let i = 0; i < converted.length; i++) {
    let io = convertTime(toUtc, i);
    converted[io] = availability[i];
  }

  return converted;
}

function convertFromUtc(availability) {
  return convertTimezone(false, availability);
}
function convertToUtc(availability) {
  return convertTimezone(true, availability);
}

function getTimezone() {
  return format(new Date(), "z");
}

function convertTime(toUtc, time) {
  let offset = new Date().getTimezoneOffset() / 30;
  time += toUtc ? offset : -offset;
  if (time < 0) time = 336 + time;
  else if (time >= 336) time = time % 336;

  return time;
}

export {
  convertFromUtc,
  convertToUtc,
  getTimezone,
  toArray,
  convertTime,
  toString
};
