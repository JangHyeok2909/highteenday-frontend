module.exports = function override(config) {
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.loader && rule.loader.includes("source-map-loader")) {
      return {
        ...rule,
        exclude: [
          ...(rule.exclude ? [rule.exclude] : []),
          /node_modules\/@toast-ui/,
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
                /node_modules\/@toast-ui/,
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
