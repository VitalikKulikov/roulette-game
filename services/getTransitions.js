import { RADIUS, X_POS, Y_POS } from "./consts";

export const getTopTransition = (currentAngle) => {
  return Math.round(X_POS + RADIUS * Math.cos(currentAngle)) + "px";
};

export const getLeftTransition = (currentAngle) => {
  return Math.round(Y_POS + RADIUS * Math.sin(currentAngle)) + "px";
};
