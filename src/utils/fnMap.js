/*
 * @Version    : v1.00
 * @Author     : Wang Chao
 * @Date       : 2024-08-19 21:34
 * @LastAuthor : Wang Chao
 * @LastTime   : 2024-08-21 13:07
 * @desc       :
 */

const Conversion = {
  // 二进制转十进制
  BinaryToDecimal: (binary) => {
    return parseInt(binary, 2).toString(10);
  },

  // 二进制转十六进制
  BinaryToHexadecimal: (binary) => {
    return parseInt(binary, 2).toString(16).toLowerCase();
  },

  // 十进制转二进制
  DecimalToBinary: (decimal) => {
    return parseInt(decimal, 10).toString(2);
  },

  // 十进制转十六进制
  DecimalToHexadecimal: (decimal) => {
    return parseInt(decimal, 10).toString(16).toLowerCase();
  },

  // 十六进制转二进制
  HexadecimalToBinary: (hexadecimal) => {
    return parseInt(hexadecimal, 16).toString(2);
  },

  // 十六进制转十进制
  HexadecimalToDecimal: (hexadecimal) => {
    return parseInt(hexadecimal, 16).toString(10);
  },

  // 将 RGB 颜色转换为 HEX 颜色格式
  RGBToHEX: (rgbString) => {
    // 从字符串中解析出 R、G、B 值
    const [r, g, b] = rgbString.split(',').map(Number);

    // 将 R、G、B 值转换为 HEX 格式
    const toHex = (x) => x.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  // 将 HEX 颜色格式转换为 RGB 颜色格式
  HEXToRGB: (hex) => {
    // 移除开头的 #
    hex = hex.replace(/^#/, '');

    // 将 HEX 颜色值转换为 RGB 分量
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // 返回 RGB 字符串
    return `${r},${g},${b}`;
  },
};

module.exports = Conversion;
