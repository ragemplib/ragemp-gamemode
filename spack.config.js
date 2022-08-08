const { config } = require('@swc/core/spack')


module.exports = config({
    entry: {
        'client': __dirname + '/src/client/index.ts',
    },
    output: {
        path: __dirname + '/client_packages/client',
        name: 'index.js'
    },
    module: {},
});
