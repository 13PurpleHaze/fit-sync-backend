module.exports = {
    apps: [{
        name: 'fit-sync',
        script: './index.js',
        exec_mode: 'cluster',
        instances: 4,
        wait_ready: true,
    }]
}