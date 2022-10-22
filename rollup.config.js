import { uglify } from "rollup-plugin-uglify";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'out-tsc/index.js',
    plugins: [uglify(), nodeResolve()],
    output: {
        name: "svg_diff_d3js_animator",
        file: 'bundle.js',
        format: 'umd'
    }
};
