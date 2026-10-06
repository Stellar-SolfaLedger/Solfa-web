const babel = require("next/dist/compiled/babel/core");

module.exports = {
  process(sourceText, sourcePath) {
    const result = babel.transformSync(sourceText, {
      filename: sourcePath,
      presets: [
        [
          require.resolve("next/dist/compiled/babel/preset-env"),
          { targets: { node: "current" } },
        ],
        [
          require.resolve("next/dist/compiled/babel/preset-react"),
          { runtime: "automatic" },
        ],
        require.resolve("next/dist/compiled/babel/preset-typescript"),
      ],
      sourceMaps: "inline",
    });
    return {
      code: result ? result.code : sourceText,
    };
  },
};
