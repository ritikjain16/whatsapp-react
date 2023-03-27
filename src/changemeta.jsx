import { theme } from "./App";
export const changeToBlack = (color = theme.black) => {
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", color);
  document
    .querySelector('meta[name="msapplication-navbutton-color"]')
    .setAttribute("content", color);
};

export const changeToTheme = (color = theme.mygreen) => {
  document.documentElement.style.setProperty("--mygreen1", color);
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", color);
  document
    .querySelector('meta[name="msapplication-navbutton-color"]')
    .setAttribute("content", color);
};
