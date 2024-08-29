// FIXME 万能转换器

import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

const Conversion = require('./utils/fnMap');

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

const fnMap = {
  1: 'BinaryToDecimal',
  2: 'BinaryToHexadecimal',
  3: 'DecimalToBinary',
  4: 'DecimalToHexadecimal',
  5: 'HexadecimalToBinary',
  6: 'HexadecimalToDecimal',
  7: 'RGBToHEX',
  8: 'HEXToRGB',
};

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        source: '待转换字段',
        changeType: '排版规则',
        fun: '自定义转换函数',
        p1: '请选择文本类型字段',
        1: '中文和英文之间需要空格',
        2: '中文和数字之间需要空格',
        3: '移除数字与符号（如度数、百分比 等）之间的空格',
        4: '统一为中文标点符号',
        5: '统一为英文标点符号',
        6: '全角标点与其他字符之间不加空格',
      },
      'en-US': {
        source: 'Field to be converted',
        changeType: 'Typography rules',
        fun: 'Custom conversion function',
        p1: 'Please select a text type field',
        1: 'Add space between Chinese characters and English characters',
        2: 'Add space between Chinese characters and numbers',
        3: 'Remove space between numbers and symbols (such as degrees, percentages, etc.)',
        4: 'Standardize to Chinese punctuation marks',
        5: 'Standardize to English punctuation marks',
        6: 'No space between full-width punctuation marks and other characters',
      },
      'ja-JP': {
        source: '変換対象のフィールド',
        changeType: 'タイポグラフィルール',
        fun: 'カスタム変換関数',
        p1: 'テキストタイプのフィールドを選択してください',
        1: '中国語と英語の間にスペースを追加する',
        2: '中国語と数字の間にスペースを追加する',
        3: '数字と記号（度数、パーセントなど）の間のスペースを削除する',
        4: '中国語の句読点に統一する',
        5: '英語の句読点に統一する',
        6: '全角句読点と他の文字の間にスペースを入れない',
      },
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'source',
      label: t('source'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
        placeholder: t('p1'),
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'changeType',
      label: t('changeType'),
      component: FieldComponent.MultipleSelect,
      props: {
        options: [
          { label: t('1'), value: 1 },
          { label: t('2'), value: 2 },
          { label: t('3'), value: 3 },
          { label: t('4'), value: 4 },
          { label: t('5'), value: 5 },
          { label: t('6'), value: 6 },
        ],
      },
      validator: {
        required: true,
      },
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Text,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { changeType: any; source: { type: string; text: string }[] | number; fun: any }) => {
    const { source, fun, changeType } = formItemParams;

    const _arr = changeType.map((i) => i.value);

    // 数字类型 source 直接为值
    //  文本类型 source 为 [{ type: 'text , text '8'}]
    const sourceValue = Array.isArray(source) && source.length > 0 ? source[0].text : source;

    function targetValueFun(input) {
      let result = input;

      // 1. 中文和英文之间需要空格
      if (_arr.includes(1)) {
        result = result
          // 中文与英文/数字之间
          .replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2')
          // 英文/数字与中文之间
          .replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2');
      }

      // 2. 中文和数字之间需要空格
      if (_arr.includes(2)) {
        result = result
          // 中文与英文/数字之间
          .replace(/([\u4e00-\u9fa5])([0-9])/g, '$1 $2')
          // 英文/数字与中文之间
          .replace(/([0-9])([\u4e00-\u9fa5])/g, '$1 $2');
      }

      // 3. 移除数字与符号之间的空格
      if (_arr.includes(3)) {
        result = result
          // 移除数字与符号之间的空格
          .replace(/(\d+)\s*(度|%|°|￥|\$|kg|cm|mm|g|m|km|lbs|oz)/g, '$1$2');
      }

      // 4. 统一符号为中文符号，如 , 替换为 ，
      if (_arr.includes(4)) {
        result = result
          // 英文逗号替换为中文逗号
          .replace(/,/g, '，')
          // 英文句号替换为中文句号
          .replace(/\./g, '。')
          // 英文问号替换为中文问号
          .replace(/\?/g, '？')
          // 英文感叹号替换为中文感叹号
          .replace(/!/g, '！')
          // 英文冒号替换为中文冒号
          .replace(/:/g, '：')
          // 英文分号替换为中文分号
          .replace(/;/g, '；')
          // 英文引号替换为中文引号
          .replace(/"/g, '“')
          // 英文单引号替换为中文单引号
          .replace(/'/g, '‘')
          // 英文括号替换为中文括号
          .replace(/\(/g, '（')
          .replace(/\)/g, '）')
          // 英文中横线替换为中文破折号
          .replace(/-/g, '——')
          // 替换省略号
          .replace(/\.{3}/g, '……');
      }

      // 统一为英文标点符号;
      if (_arr.includes(5)) {
        result = result
          // 中文逗号替换为英文逗号
          .replace(/，/g, ',')
          // 中文句号替换为英文句号
          .replace(/。/g, '.')
          // 中文问号替换为英文问号
          .replace(/？/g, '?')
          // 中文感叹号替换为英文感叹号
          .replace(/！/g, '!')
          // 中文冒号替换为英文冒号
          .replace(/：/g, ':')
          // 中文分号替换为英文分号
          .replace(/；/g, ';')
          // 中文双引号替换为英文双引号
          .replace(/“/g, '"')
          // 中文单引号替换为英文单引号
          .replace(/‘/g, "'")
          // 中文括号替换为英文括号
          .replace(/（/g, '(')
          .replace(/）/g, ')')
          // 中文破折号替换为英文中横线
          .replace(/——/g, '-')
          // 中文省略号替换为英文省略号
          .replace(/……/g, '...');
      }

      // 全角标点与其他字符之间不加空格
      if (_arr.includes(6)) {
        result = result // 移除全角标点（如中文逗号、句号等）后的空格
          .replace(/([，。！？；：、【】《》〔〕（）……])\s+/g, '$1')
          // 移除全角标点（如中文逗号、句号等）前的空格
          .replace(/\s+([，。！？；：、【】《》〔〕（）……])/g, '$1');
      }
      return result;
    }

    // 选了预置转换类型，则以预置转换类型为准
    let targetValue = targetValueFun(sourceValue);

    try {
      return {
        code: FieldCode.Success,
        data: targetValue,
      };
    } catch (e) {
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;
