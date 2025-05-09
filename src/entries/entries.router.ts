import Router from 'koa-router'
import getEntryTokenBucket from './middlewares/get-entry-token-bucket'
import fakeDb from '../common/fake-db'

const entriesRouter = new Router({ prefix: '/api/entries' })

entriesRouter.post('/', (ctx) => {
  const { name, key, keyType } = ctx.request.body as any

  if (!name || !key || !keyType) {
    ctx.status = 400
    return
  }

  const newEntry = { name, key, keyType, endToEndId: crypto.randomUUID() }
  fakeDb.entries.set(key, newEntry)
  fakeDb.lastEntriesCreated.add(newEntry.endToEndId)

  ctx.status = 201
  ctx.body = newEntry
})

entriesRouter.get('/:key', getEntryTokenBucket, (ctx) => {
  ctx.status = 200
})

export default entriesRouter
