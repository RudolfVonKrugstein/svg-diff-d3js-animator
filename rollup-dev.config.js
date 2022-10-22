import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'out-tsc/index.js',
    plugins: [serve(), livereload(), nodeResolve()],
    output: {
        name: "svg_diff_d3js_animator",
        file: 'bundle.js',
        format: 'umd'
    }
};
