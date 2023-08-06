const burger = () => {
  let startTime = NaN;
  const durationOpacity = 300;

  const body = document.querySelector('body');
  const burgerButton = document.querySelector('.header__menu-button');
  const burgerMenu = document.querySelector('.header__menu');

  const showMenu = (timestamp) => {
    startTime ||= timestamp;
    const progress = (timestamp - startTime) / durationOpacity;
    burgerMenu.style.opacity = progress;

    if (progress < 1) {
      requestAnimationFrame(showMenu, 10);
    }
  };

  const hideMenu = (timestamp) => {
    startTime ||= timestamp;
    const progress = (timestamp - startTime) / durationOpacity;
    burgerMenu.style.opacity = 1 - progress;

    if (progress < 1) {
      requestAnimationFrame(hideMenu, 10);
    }
  };

  body.addEventListener('click', (event) => {
    if (event.target === burgerButton) {
      burgerMenu.classList.contains('header__menu_active') ?
        requestAnimationFrame(hideMenu) : requestAnimationFrame(showMenu);
      burgerMenu.classList.toggle('header__menu_active');
    } else if (event.target !== burgerMenu &&
      !event.target.classList.contains('header__item') &&
      !event.target.classList.contains('header__list')) {
      burgerMenu.classList.remove('header__menu_active');
      requestAnimationFrame(hideMenu);
    }
  });
};

export default burger;
