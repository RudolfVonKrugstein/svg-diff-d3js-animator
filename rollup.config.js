import { uglify } from "rollup-plugin-uglify";

export default {
    input: 'out-tsc/index.js',
    plugins: [uglify()],
    output: {
        name: "svg_diff_d3js_animator",
        file: 'bundle.js',
        format: 'umd'
    }
};
