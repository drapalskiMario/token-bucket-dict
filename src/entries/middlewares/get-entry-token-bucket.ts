import { Next, ParameterizedContext } from 'koa'
import { Event, TokenBucketManagement } from '../../common/token-bucket-manager'
import fakeDb from '../../common/fake-db'
import entryService from '../entries.service'

const baseParamsToken = {
  ttl: 3000,
  decrementValueOnError: 20,
  decrementValueOnSuccess: 1,
  incremetValueOnSuccess: 1,
}

const legalPersonCNPJTokenBucket = new TokenBucketManagement({
  name: 'get_entry_legal_person_cnpj',
  capacity: 1000,
  refillRate: 20,
  ...baseParamsToken,
})
const legalPersonEmailPhoneTokenBucket = new TokenBucketManagement({
  name: 'get_entry_legal_person_email_phone',
  capacity: 1000,
  refillRate: 20,
  ...baseParamsToken,
})
const naturalPersonCPFTokenBucket = new TokenBucketManagement({
  name: 'get_entry_natural_person_cpf',
  capacity: 100,
  refillRate: 2,
  ...baseParamsToken,
})
const naturalPersonEmailPhoneTokenBucket = new TokenBucketManagement({
  name: 'get_entry_natural_person_email_phone',
  capacity: 100,
  refillRate: 2,
  ...baseParamsToken,
})

export default async (ctx: ParameterizedContext, next: Next) => {
  const pspId = ctx.get('PI-RequestingParticipant')
  const userId = ctx.get('PI-PayerId')
  const endToEndId = ctx.get('PI-EndToEndId')

  if (!pspId || !userId) {
    ctx.status = 400
    return
  }

  const userType = entryService.getUserType(userId)
  if (!userType) {
    ctx.status = 400
    return
  }

  const keyType = entryService.getKeyType(ctx.params.key)
  if (!keyType) {
    ctx.status = 400
    return
  }

  let userTokenBucket: TokenBucketManagement
  if (userType === 'CPF') {
    userTokenBucket = ['CPF', 'CNPJ', 'EPV'].includes(keyType) ? naturalPersonCPFTokenBucket : naturalPersonEmailPhoneTokenBucket
  } else {
    userTokenBucket = ['CPF', 'CNPJ', 'EPV'].includes(keyType) ? legalPersonCNPJTokenBucket : legalPersonEmailPhoneTokenBucket
  }

  const tokenIdentification = `${pspId}-${userId}`

  const allowRequest = await userTokenBucket.allowRequest(tokenIdentification)
  if (!allowRequest) {
    ctx.status = 429
    return
  }

  const key = fakeDb.entries.get(ctx.params.key)
  if (!key) {
    await userTokenBucket.updateTokenValue(tokenIdentification, Event.DECREMENT_ERROR)
    ctx.status = 404
    return
  }

  if (endToEndId && fakeDb.lastEntriesCreated.has(endToEndId)) {
    await userTokenBucket.updateTokenValue(tokenIdentification, Event.INCREMENT_SUCESS)
    fakeDb.lastEntriesCreated.delete(endToEndId)
  } else {
    await userTokenBucket.updateTokenValue(tokenIdentification, Event.DECREMENT_SUCESS)
  }

  ctx.body = key
  next()
}
