import Router from 'koa-router'
import { redis } from '../common/redis-service'

const bucketsRouter = new Router({ prefix: '/api/buckets' })

bucketsRouter.get('/:type', async (ctx) => {
  const pspId = ctx.get('PI-RequestingParticipant')
  const userId = ctx.get('PI-PayerId')
  const type = ctx.params.type

  if (!pspId || !userId || !type) {
    ctx.status = 400
    return
  }

  const keyBucket = `${type}:${pspId}-${userId}`

  ctx.status = 200
  ctx.body = await redis.hgetall(keyBucket)
})

export default bucketsRouter
