import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
const input = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenDate = selectedDates[0];

    if (chosenDate <= new Date()) {
      startBtn.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });

      return;
    }

    userSelectedDate = chosenDate;
    startBtn.disabled = false;
  },
};

flatpickr(input, options);

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) {
    return;
  }

  startBtn.disabled = true;
  input.disabled = true;

  updateCountdown();

  timerId = setInterval(updateCountdown, 1000);
});

function updateCountdown() {
  const currentTime = new Date();
  const deltaTime = userSelectedDate - currentTime;

  if (deltaTime <= 0) {
    clearInterval(timerId);
    updateTimerFace({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    input.disabled = false;
    startBtn.disabled = true;
    return;
  }

  const time = convertMs(deltaTime);
  updateTimerFace(time);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}