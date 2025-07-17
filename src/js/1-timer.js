import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerId = null;

const refs = {
  startBtn: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selected;
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const delta = userSelectedDate - currentTime;

    if (delta <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0);
      refs.input.disabled = false;
      return;
    }

    updateTimerDisplay(delta);
  }, 1000);
}

function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  refs.daysEl.textContent = addLeadingZero(days);
  refs.hoursEl.textContent = addLeadingZero(hours);
  refs.minutesEl.textContent = addLeadingZero(minutes);
  refs.secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
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

console.log('✅ flatpickr script loaded');
