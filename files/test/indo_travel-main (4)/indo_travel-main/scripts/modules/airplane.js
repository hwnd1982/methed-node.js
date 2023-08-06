const docEl = document.documentElement;
const airplane = document.createElement('div');

airplane.style.cssText = `
  position: fixed;
  width: 50px;
  height: 50px;
  right: 0px;
  bottom: 0;
  pointer-events: none;
  background-image: url('img/airplane.svg');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

document.body.append(airplane);


const calcPositionAirplane = () => {
  const maxBottom = docEl.scrollHeight - docEl.clientHeight;
  const maxAirplaneBottom = docEl.clientHeight - airplane.clientHeight;
  const percentScroll = (window.pageYOffset * 100) / maxBottom;
  const airplaneBottom = maxAirplaneBottom * (percentScroll / 100);

  airplane.style.transform = `translateY(-${airplaneBottom}px)`;
};

window.addEventListener('scroll', () => {
  requestAnimationFrame(calcPositionAirplane);
});

calcPositionAirplane();
