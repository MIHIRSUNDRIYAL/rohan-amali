const marriageDate = new Date("2026-07-27T14:00:00+10:00");
const elements = {
  years: document.getElementById("years"),
  months: document.getElementById("months"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function animateUnit(key) {
  const valueElement = elements[key];
  const unitCard = valueElement && valueElement.closest(".unit");
  if (!unitCard) return;
  unitCard.classList.remove("is-changing");
  void unitCard.offsetWidth;
  unitCard.classList.add("is-changing");
  window.setTimeout(() => unitCard.classList.remove("is-changing"), 280);
}

function addYears(date, amount) {
  const result = new Date(date);
  const month = result.getMonth();
  result.setFullYear(result.getFullYear() + amount);
  if (result.getMonth() !== month) {
    result.setDate(0);
  }
  return result;
}

function addMonths(date, amount) {
  const result = new Date(date);
  const day = result.getDate();
  const totalMonths = result.getFullYear() * 12 + result.getMonth() + amount;
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths % 12;
  const lastDay = new Date(year, month + 1, 0).getDate();
  result.setFullYear(year, month, Math.min(day, lastDay));
  return result;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function getElapsedCalendarDuration(from, to) {
  if (to < from) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  let cursor = new Date(from);
  let years = 0;

  while (true) {
    const next = addYears(cursor, 1);
    if (next > to) break;
    cursor = next;
    years += 1;
  }

  let months = 0;
  while (true) {
    const next = addMonths(cursor, 1);
    if (next > to) break;
    cursor = next;
    months += 1;
  }

  let days = 0;
  while (true) {
    const next = addDays(cursor, 1);
    if (next > to) break;
    cursor = next;
    days += 1;
  }

  const remainderMs = to - cursor;
  const hours = Math.floor(remainderMs / 3600000);
  const minutes = Math.floor((remainderMs % 3600000) / 60000);
  const seconds = Math.floor((remainderMs % 60000) / 1000);

  return { years, months, days, hours, minutes, seconds };
}

function updateTimer() {
  const now = new Date();
  const elapsed = getElapsedCalendarDuration(marriageDate, now);
  const nextValues = { ...elapsed };
  Object.entries(nextValues).forEach(([key, value]) => {
    const currentValue = elements[key].textContent;
    elements[key].textContent = String(value).padStart(2, "0");
    if (currentValue !== String(value).padStart(2, "0")) {
      animateUnit(key);
    }
  });
}

updateTimer();
setInterval(updateTimer, 1000);
