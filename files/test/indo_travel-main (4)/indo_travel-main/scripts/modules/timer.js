const beginTimer = () => {
  const daysDeclension = ['день', 'дня', 'дней'];
  const hoursDeclension = ['час', 'часа', 'часов'];
  const minutesDeclension = ['минута', 'минуты', 'минут'];
  const secondsDeclension = ['секунда', 'секунды', 'секунд'];
  const msPerSec = 1000;
  const secPerMin = 60;
  const minPerHour = 60;
  const hoursPerDay = 24;
  const oneDayRemaining = hoursPerDay * minPerHour * secPerMin * msPerSec;
  const GMTplusThree = 3 * minPerHour;

  const timerDays = document.querySelector('.timer__count_days');
  const timerHours = document.querySelector('.timer__count_hours');
  const timerMinutes = document.querySelector('.timer__count_minutes');
  const daysUnits = document.querySelector('.timer__units_days');
  const hoursUnits = document.querySelector('.timer__units_hours');
  const minutesUnits = document.querySelector('.timer__units_minutes');
  const deadline =
    document.querySelector('.timer').getAttribute('data-timer-deadline');
  const promotionText = document.querySelector('.hero__text');
  const promotionTimer = document.querySelector('.hero__timer');
  const timerDaysContainer = document.querySelector('.timer__item_days');

  const convertDateToGMT = (date, offset) => {
    const utc =
      date.getTime() + (date.getTimezoneOffset() * (msPerSec * secPerMin));
    const newDate = new Date(utc + (msPerSec * secPerMin * offset));
    return newDate;
  };

  const getTimeRemaining = () => {
    const dateNow = convertDateToGMT(new Date(), GMTplusThree);
    const dateStop = new Date(deadline).getTime();
    const timeRemaining = dateStop - dateNow;

    const seconds = Math.floor(timeRemaining / 1000 % 60);
    const minutes = Math.floor(timeRemaining / 1000 / 60 % 60);
    const hours = Math.floor(timeRemaining / 1000 / 60 / 60 % 24);
    const days = Math.floor(timeRemaining / 1000 / 60 / 60 / 24);

    return {
      timeRemaining,
      seconds,
      minutes,
      hours,
      days,
    };
  };

  const wordDeclension = (num, arr) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return arr[(num % 100 > 4 && num % 100 < 20) ?
      2 : cases[(num % 10 < 5) ? num % 10 : 5]];
  };

  const numsTwoDigit = (num) => `0${num}`.slice(-2);

  const oneDayRemainingTimer = () => {
    const timer = getTimeRemaining();
    if (timer.timeRemaining < oneDayRemaining) {
      timerDaysContainer.remove();
      promotionTimer.insertAdjacentHTML('beforeend', `
      <p class="timer__item timer__item_seconds">
        <span class="timer__count timer__count_seconds">00</span>
        <span class="timer__units timer__units_seconds">секунд</span>
      </p>
    `);
    }
  };

  oneDayRemainingTimer();

  const startTimer = () => {
    const timer = getTimeRemaining();

    timerDays.textContent = timer.days;
    timerHours.textContent = numsTwoDigit(timer.hours);
    timerMinutes.textContent = numsTwoDigit(timer.minutes);

    const intervalId = setTimeout(startTimer, 1000);

    const daysText = wordDeclension(timer.days, daysDeclension);
    const hoursText = wordDeclension(timer.hours, hoursDeclension);
    const minutesText = wordDeclension(timer.minutes, minutesDeclension);

    daysUnits.textContent = daysText;
    hoursUnits.textContent = hoursText;
    minutesUnits.textContent = minutesText;

    if (timer.timeRemaining < oneDayRemaining) {
      const timerSeconds = document.querySelector('.timer__count_seconds');
      const secondsUnits = document.querySelector('.timer__units_seconds');

      timerSeconds.textContent = numsTwoDigit(timer.seconds);
      const secondsText = wordDeclension(timer.seconds, secondsDeclension);
      secondsUnits.textContent = secondsText;
    }

    if (timer.timeRemaining <= 0) {
      clearInterval(intervalId);
      promotionText.remove();
      promotionTimer.remove();
    }
  };

  startTimer();
};

export default beginTimer;
