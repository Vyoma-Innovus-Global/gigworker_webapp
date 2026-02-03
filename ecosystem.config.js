module.exports = {
  apps: [
    {
      name: "gig-nex",
      script: "npm",
      args: "start",
      env: {
        PORT: 4000,
        // PORT: 6969,
        HOST: "0.0.0.0",
        NODE_ENV: "production"
      }
    }
  ]
};
