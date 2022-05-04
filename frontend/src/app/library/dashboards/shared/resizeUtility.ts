// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
const waitForElement = (selector: string) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

const getTextWidth = (text: any, canvasElement: any, font: string) => {
  const canvas = canvasElement || (canvasElement = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return {width: metrics.width, canvas: canvasElement};
}

export {getTextWidth, waitForElement};
