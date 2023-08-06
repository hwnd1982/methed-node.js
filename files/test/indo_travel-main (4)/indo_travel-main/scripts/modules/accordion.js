const accordion = () => {
  const travelItems = document.querySelectorAll('.travel__item');
  const travelTextWrappers =
    document.querySelectorAll('.travel__item-text-wrapper');

  let textWrapperHeight = 0;

  travelTextWrappers.forEach(wrapper => {
    if (textWrapperHeight < wrapper.scrollHeight) {
      textWrapperHeight = wrapper.scrollHeight;
    }
  });

  travelItems.forEach((travelItem, index) => {
    travelItem.addEventListener('click', () => {
      for (let i = 0; i < travelItems.length; i++) {
        if (index === i) {
          travelTextWrappers[i].style.height =
            travelItems[i].classList.contains('travel__item_active') ?
              '' : `${textWrapperHeight}px`;
          travelItems[i].classList.toggle('travel__item_active');
        } else {
          travelItems[i].classList.remove('travel__item_active');
          travelTextWrappers[i].style.height = '';
        }
      }
    });
  });
};

export default accordion;
