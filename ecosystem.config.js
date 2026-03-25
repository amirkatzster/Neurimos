module.exports = {
  apps: [{
    name: 'neurimos',
    script: 'dist/server/app.js',
    instances: 0,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
