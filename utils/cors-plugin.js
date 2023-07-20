// cors-plugin.js
function customCorsPlugin(fastify, options, done) {
    fastify.addHook("onSend", (request, reply, payload, next) => {
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header("Access-Control-Allow-Methods", "GET"); // Allow only GET requests
      next();
    });
  
    done();
  }
  
  module.exports = customCorsPlugin;