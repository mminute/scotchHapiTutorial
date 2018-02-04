import Hapi from 'hapi';

const server = new Hapi.Server({ port: 3000, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/hello',
  // (request, h)
  handler: () => 'helloworld',
});

try {
  server.start().then(console.log(`Server Started! ${server.info.uri}`));
} catch (err) {
  console.log('Error handling!');
  console.log(err);
}
