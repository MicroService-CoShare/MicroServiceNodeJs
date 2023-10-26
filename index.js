const { server } = require('./app');

const PORT = process.env.PORT || 3005;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
