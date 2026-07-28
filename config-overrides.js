// Windows는 경로 구분자가 "\" 이므로 두 가지 모두 매칭해야 한다
const TOAST_UI = /node_modules[\\/]@toast-ui/;

module.exports = function override(config) {
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.loader && rule.loader.includes("source-map-loader")) {
      return {
        ...rule,
        exclude: [
          ...(rule.exclude ? [rule.exclude] : []),
          TOAST_UI,
        ],
      };
    }
    // rules 배열 안에 oneOf가 있는 경우 처리
    if (rule.oneOf) {
      return {
        ...rule,
        oneOf: rule.oneOf.map((r) => {
          if (r.loader && r.loader.includes("source-map-loader")) {
            return {
              ...r,
              exclude: [
                ...(r.exclude ? [r.exclude] : []),
                TOAST_UI,
              ],
            };
          }
          return r;
        }),
      };
    }
    return rule;
  });

  return config;
};
