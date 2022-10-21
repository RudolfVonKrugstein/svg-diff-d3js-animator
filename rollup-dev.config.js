import { uglify } from "rollup-plugin-uglify";
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
    input: 'out-tsc/index.js',
    plugins: [serve(), livereload()],
    output: {
        name: "svg_diff_d3js_animator",
        file: 'bundle.js',
        format: 'umd'
    }
};
