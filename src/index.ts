import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import entryRouter from './entries/entries.router'
import bucketsRouter from './buckets/buckets.router'

const app = new Koa()

app
  .use(bodyParser())
  .use(entryRouter.routes())
  .use(entryRouter.allowedMethods())
  .use(bucketsRouter.routes())
  .use(bucketsRouter.allowedMethods())

app.listen(3000, () => console.log('Server on 3000'))
