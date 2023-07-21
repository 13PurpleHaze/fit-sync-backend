module.exports = {
    apps: [{
        name: 'fit-sync',
        script: './index.js',
        exec_mode: 'cluster',
        instances: 8,
        wait_ready: true,
    }]
}