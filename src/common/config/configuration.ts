export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '4000'),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
  },
  db: {
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    mongo: {
      host: process.env.MONGO_INITDB_HOST,
      userPass: process.env.MONGO_INITDB_USER_PASS,
      port: parseInt(process.env.MONGO_PORT || '27017'),
      baseUri: process.env.MONGO_INITDB_BASE_URI,
      database: process.env.MONGO_INITDB_DATABASE,
    },
  },
  app: {
    defaultPageSize: 10,
  },
});

export const AppPageSize = configuration().app.defaultPageSize;
