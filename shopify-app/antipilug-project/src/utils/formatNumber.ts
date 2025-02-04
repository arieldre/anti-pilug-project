export const formatNumber = (num: number): string => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
    let suffixIndex = 0;
    
    while (num >= 1000 && suffixIndex < suffixes.length - 1) {
      num /= 1000;
      suffixIndex++;
    }
    
    return num >= 100
      ? `${Math.floor(num)}${suffixes[suffixIndex]}`
      : num.toFixed(1).replace(/\.0$/, '') + suffixes[suffixIndex];
  };
  