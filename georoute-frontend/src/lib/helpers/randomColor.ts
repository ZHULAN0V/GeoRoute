// Утилиты для генерации случайных цветов маршрутов и их вариантов.
// Используем HSL: hue — случайный, saturation — фиксированно высокое,
// lightness — разный диапазон, чтобы маршруты были темнее, а варианты светлее.

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const hslToHex = (h: number, s: number, l: number): string => {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const hSegment = h / 60;
  const x = c * (1 - Math.abs((hSegment % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hSegment >= 0 && hSegment < 1) {
    r1 = c;
    g1 = x;
  } else if (hSegment < 2) {
    r1 = x;
    g1 = c;
  } else if (hSegment < 3) {
    g1 = c;
    b1 = x;
  } else if (hSegment < 4) {
    g1 = x;
    b1 = c;
  } else if (hSegment < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  const m = lNorm - c / 2;
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
};

export const randomPathColor = (): string => {
  const hue = randomInt(0, 359);
  const saturation = randomInt(60, 85);
  const lightness = randomInt(25, 40);
  return hslToHex(hue, saturation, lightness);
};

export const randomVariantColor = (): string => {
  const hue = randomInt(0, 359);
  const saturation = randomInt(55, 80);
  const lightness = randomInt(55, 70);
  return hslToHex(hue, saturation, lightness);
};
