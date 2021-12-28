const config = () => ({
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET,
  database: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
});

export default config;
