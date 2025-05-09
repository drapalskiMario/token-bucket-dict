import { redis } from './redis-service'

interface State {
  tokens: number
  lastRefill: number
}

export enum Event {
  INCREMENT_SUCESS,
  DECREMENT_SUCESS,
  DECREMENT_ERROR,
}

export class TokenBucketManagement {
  #redis = redis
  #capacity: number // Capacidade máxima de tokens
  #refillRate: number // Tokens por minuto
  #ttl: number // Tempo de vida do bucket em segundos
  #name: string

  #decrementValueOnError?: number
  #decrementValueOnSuccess?: number
  #incremetValueOnSuccess?: number

  constructor(input: {
    name: string
    capacity: number
    refillRate: number
    ttl: number
    decrementValueOnError?: number
    decrementValueOnSuccess?: number
    incremetValueOnSuccess?: number
  }) {
    this.#capacity = input.capacity
    this.#refillRate = input.refillRate
    this.#ttl = input.ttl
    this.#name = input.name
    this.#decrementValueOnSuccess = input.decrementValueOnSuccess
    this.#decrementValueOnError = input.decrementValueOnError
    this.#incremetValueOnSuccess = input.incremetValueOnSuccess
  }

  private async getBucket(tokenIndentification: string) {
    const key = `${this.#name}:${tokenIndentification}`
    const data = await this.#redis.hgetall(key)

    if (!data.tokens) {
      const initialState: State = {
        tokens: this.#capacity,
        lastRefill: Date.now() / 1000,
      }
      await this.#redis.hset(key, initialState)
      await this.#redis.expire(key, this.#ttl)
      return {
        ...initialState,
        createdNow: true,
      }
    }

    return {
      tokens: parseInt(data.tokens),
      lastRefill: parseInt(data.lastRefill),
      createdNow: false,
    }
  }

  private async updateBucket(tokenIndentification: string, state: State) {
    const key = `${this.#name}:${tokenIndentification}`
    await this.#redis.hset(key, {
      tokens: state.tokens,
      lastRefill: state.lastRefill,
    })
    await this.#redis.expire(key, this.#ttl)
  }

  async allowRequest(tokenIndentification: string) {
    const state = await this.getBucket(tokenIndentification)
    if (state.createdNow) {
      return true
    }

    const now = Date.now() / 1000
    const elapsedSeconds = now - state.lastRefill
    const elapsedMinutes = elapsedSeconds / 60
    const newTokens = Math.floor(elapsedMinutes * this.#refillRate)

    state.tokens = Math.min(this.#capacity, state.tokens + newTokens)
    state.lastRefill = now

    await this.updateBucket(tokenIndentification, state)

    if (state.tokens >= 1) {
      return true
    }

    return false
  }

  async updateTokenValue(tokenIndentification: string, event: Event) {
    const state = await this.getBucket(tokenIndentification)
    if (event === Event.DECREMENT_ERROR && this.#decrementValueOnError) {
      state.tokens -= this.#decrementValueOnError
      await this.updateBucket(tokenIndentification, state)
      return
    }

    if (event === Event.DECREMENT_SUCESS && this.#decrementValueOnSuccess) {
      state.tokens -= this.#decrementValueOnSuccess
      await this.updateBucket(tokenIndentification, state)
      return
    }

    if (event === Event.INCREMENT_SUCESS && this.#incremetValueOnSuccess) {
      state.tokens -= this.#incremetValueOnSuccess
      await this.updateBucket(tokenIndentification, state)
      return
    }
  }
}
