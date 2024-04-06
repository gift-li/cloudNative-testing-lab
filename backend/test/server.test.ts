import { describe, expect, test } from 'vitest'
import { serverOf } from '../src/server'

describe('Server Testing', () => {

  test('When send a GET request to /ping, it should return status code 200', async () => {
    // arrange: create a server instance
    const server = serverOf()

    // act: send a GET request to /ping
    const response = await server.inject({
      method: 'GET',
      url: '/ping'
    })

    // assert: response should be status code 200
    expect(response.statusCode).toBe(200)
  })
})
