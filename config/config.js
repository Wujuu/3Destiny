module.exports = {
  facebook: {
    id: 1715695388664847,
    secret: "d84df9a2c8dad1ecf645bcf88fbef252",
    callbackURL: "https://crud-zionn.c9users.io/auth/facebook/callback"
  },
  google: {
    id: 1715695388664847,
    secret: "d84df9a2c8dad1ecf645bcf88fbef252",
    callbackURL: "https://crud-zionn.c9users.io/auth/facebook/callback"
  },
  twitter: {
    id: 1715695388664847,
    secret: "d84df9a2c8dad1ecf645bcf88fbef252",
    callbackURL: "https://crud-zionn.c9users.io/auth/facebook/callback"
  },
  db: {
    url: "mongodb://"+process.env.IP+":27017/crud"
  },
  app: {
    port: process.env.IP
  }
};
