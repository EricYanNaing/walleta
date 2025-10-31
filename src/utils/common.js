// Common functions
import Best from '../assets/img/hearts.png'
import Content from '../assets/img/irritated.png'
import Okay from '../assets/img/smiling-face.png'
import Bad from '../assets/img/emoji.png'

// Split Number with ',' (comma) every 3 digits.
export const splitNumberComma = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Decide the emoji with 4 stages
export const emotionEmoji = (balance) => {
  const limit = 100000;
  const ratio = balance / limit;

  if (ratio >= 1.3) return Best;     // Best
  if (ratio >= 1.0) return Okay;     // Okay
  if (ratio >= 0.9) return Content;     // Content
  return Bad;                       // Bad
};

export const formatPrettyDate = (d) => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  return date.toString().split("GMT")[0].trim();
};