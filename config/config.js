module.exports = {
  development: {
      facebook: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/facebook/callback"
      },
      google: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/google/callback"
      },
      twitter: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/twitter/callback"
      },
      db: {
        url: "mongodb://"+process.env.IP+":27017/crud"
      }
  },
  production: {
      facebook: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/facebook/callback"
      },
      google: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/google/callback"
      },
      twitter: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/twitter/callback"
      },
      db: {
        url: "mongodb://"+process.env.IP+":27017/crud"
      }
  },
  app: {
    ip: process.env.IP
  }
};