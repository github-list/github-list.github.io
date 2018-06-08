function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
  ] : null;
}

function calculateColorValue(c) {
  const Crsgb = c / 255;

  if (Crsgb <= 0.03928) {
    return Crsgb / 12.92;
  }

  return ((Crsgb + 0.055) / 1.055) ** 2.4;
}

function calculateLuminance(color) {
  const [R, G, B] = color.map(calculateColorValue);

  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  return L;
}

export const calculateRatio = (light, dark) => {
  const L1 = calculateLuminance(hexToRgb(light));
  const L2 = calculateLuminance(hexToRgb(dark));

  return (L1 + 0.05) / (L2 + 0.05);
}