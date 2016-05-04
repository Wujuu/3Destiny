module.exports = {
  development: {
      facebook: {
        id: 1715695388664847,
        secret: "d84df9a2c8dad1ecf645bcf88fbef252",
        callbackURL: "https://web3destiny-zionn.c9users.io/auth/facebook/callback"
      },
      google: {
        id: "1022969293951-me54ti5jaij8kf9c4li8eospsred1iu5.apps.googleusercontent.com",
        secret: "3KDsIcKAJ7q_7ahXML1l4Dl8",
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
        id: 1022969293951,
        secret: "ETbREWJzwjF-o8TGn-zcderY",
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