var async = require("rollup-plugin-async");

export default args => {
    const result = args.configDefaultConfig;

    result.forEach(config => {
        // config.context = 'window';
        // config.moduleContext = 'window';
        //
        // const defaultOnWarn = config.onwarn;
        //
        // config.onwarn = warning => {
        //     // if (warning.code === "THIS_IS_UNDEFINED" || warning.code === "SOURCEMAP_ERROR") {
        //     //   return;
        //     // }
        //     defaultOnWarn(warning);
        // };
        //
        // const plugins = config.plugins || [];
        //
        //
        // config.plugins = [async(), ...plugins]
        //
        // console.log("\n", config, "\n");
        //

    });


    return result;
};