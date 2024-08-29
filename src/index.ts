// FIXME 公历农历转换

import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

const moment = require('moment');
require('moment-lunar');

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        source: '待转换字段',
        changeType: '转换规则',
        p1: '请选择日期类型字段',
        1: '公历转农历',
        2: '农历转公历',
      },
      'en-US': {
        source: 'Field to be converted',
        changeType: 'Conversion Rule',
        p1: 'Please select a date type field',
        '1': 'Gregorian to Lunar',
        '2': 'Lunar to Gregorian',
      },
      'ja-JP': {
        source: '変換するフィールド',
        changeType: '変換ルール',
        p1: '日付タイプのフィールドを選択してください',
        '1': 'グレゴリオ暦から旧暦へ',
        '2': '旧暦からグレゴリオ暦へ',
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
        supportType: [FieldType.DateTime],
        placeholder: t('p1'),
      },
      validator: {
        required: true,
      },
    },
    {
      key: 'changeType',
      label: t('changeType'),
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: t('1'), value: 1 },
          { label: t('2'), value: 2 },
        ],
      },
      validator: {
        required: true,
      },
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.DateTime,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { changeType: any; source: { type: string; text: string }[] | number }) => {
    const { source, changeType } = formItemParams;

    const sourceValue = source;

    // 公历转农历
    function GregorianToLunar(input) {
      // 步骤 1: 将时间戳转换为公历日期
      const solarDate = moment(input);

      // 步骤 2: 将公历日期转换为农历日期
      const lunarDate = solarDate.lunar();

      // 返回对应的公历时间戳
      return moment(lunarDate, 'YYYY-MM-DD').valueOf();
    }

    // 农历转公历
    function LunarToGregorian(input) {
      // 步骤 1: 将毫秒级农历时间戳转换为公历日期
      // 首先将时间戳转换为 moment 对象，假设这个时间戳是一个农历日期的时间戳
      const lunarDate = moment(input);

      // 将农历时间戳转换为公历日期
      const solarDate = moment()
        .year(lunarDate.year())
        .month(lunarDate.month()) // 注意：月份是从0开始的，所以直接使用 lunarDate.month()
        .date(lunarDate.date())
        .solar()
        .format('YYYY-MM-DD');

      // 返回对应的公历时间戳（毫秒级）
      return moment(solarDate, 'YYYY-MM-DD').valueOf();
    }

    // 选了预置转换类型，则以预置转换类型为准
    let targetValue = changeType.value === 1 ? GregorianToLunar(sourceValue) : LunarToGregorian(sourceValue);

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
