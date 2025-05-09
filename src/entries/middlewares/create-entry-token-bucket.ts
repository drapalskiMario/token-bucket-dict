import { Next, ParameterizedContext } from 'koa'
import { Event, TokenBucketManagement } from '../../common/token-bucket-manager'

const createEntryTokenBucket = new TokenBucketManagement({
  name: 'create_entry_token_bucket',
  capacity: 1000,
  refillRate: 20,
  ttl: 90,
  decrementValueOnSuccess: 1,
})

export default async (ctx: ParameterizedContext, next: Next) => {
  const tokenIdentification = ctx.get('PI-RequestingParticipant')

  const allowRequest = await createEntryTokenBucket.allowRequest(tokenIdentification)
  if (!allowRequest) {
    ctx.status = 429
    return
  }

  await next()

  if (ctx.status !== 500) {
    createEntryTokenBucket.updateTokenValue(tokenIdentification, Event.DECREMENT_SUCESS)
  }
}
