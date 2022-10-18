// var async = require("rollup-plugin-async");

export default args => {
    const result = args.configDefaultConfig;

    result.forEach(config => {

      const defaultOnWarn = config.onwarn;
      config.onwarn = warning => {
        if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "SOURCEMAP_ERROR") {
          return;
        }
        defaultOnWarn(warning);
      };

      config.context = this;


      console.log("\n", config, "\n");
    });


    return result;
};