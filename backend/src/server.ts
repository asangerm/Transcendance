import Fastify from 'fastify'
import cors from '@fastify/cors'

async function startServer() {
  const fastify = Fastify({
    logger: true
  })

  // Enable CORS
  await fastify.register(cors, {
    origin: true
  })

  // Test route
  fastify.get('/', async (request, reply) => {
    return { message: 'Backend is working!' }
  })

  // Start the server
  try {
    await fastify.listen({ port: 8000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

startServer() 