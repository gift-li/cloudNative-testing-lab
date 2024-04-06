import { beforeEach, describe, expect, test, vi } from 'vitest'
import { serverOf } from '../src/server'
import * as TodoRepo from '../src/repo/todo'
import { ModifyResult, UpdateQuery, Types } from 'mongoose'
import { Todo } from '../src/types/todo'

describe('Todo API Testing', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  const server = serverOf()

  describe('[getTodos] case', () => {
    test('send a GET request , it should return status 200', async () => {
      // arrange: stub the repo function to return an array of todo objects
      vi.spyOn(TodoRepo, 'findAllTodos')
        .mockResolvedValue([{ id: '1', name: '', description: '', status: false }])

      // act: send a GET request to /api/v1/todos
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/todos'
      })

      // assert: response should be status 200
      expect(response.statusCode).toBe(200)

      // assert: response body should be an array of todo objects
      expect(response.json()).toMatchObject({
        todos: [{ id: '1', name: '', description: '', status: false }]
      })
    })

    test('send a GET request with error , it should return status 500', async () => {
      const error = 'Error'
      // arrange: stub the repo function to return an array of todo objects
      vi.spyOn(TodoRepo, 'findAllTodos')
        .mockRejectedValue(new Error())

      // act: send a GET request to /api/v1/todos
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/todos'
      })

      // assert: response should be status 500
      expect(response.statusCode).toBe(500)

      // assert: response body should be an error message
      expect(response.body).toBe(`[Server Error]: ${error}`)
    })
  })

  describe('[createTodo] case', () => {
    test('send a POST request with correct body , it should return status 201', async () => {
      // arrange: stub the repo function to return a todo object
      vi.spyOn(TodoRepo, 'createTodo')
        .mockResolvedValue({ id: '1', name: '', description: '', status: false })

      // act: send a POST request to /api/v1/todos
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/todos',
        body: { id: '1', name: '', description: '', status: false }
      })

      // assert: response should be status 201
      expect(response.statusCode).toBe(201)

      // assert: response body should be a todo object
      expect(response.json()).toMatchObject({
        todo: { id: '1', name: '', description: '', status: false }
      })
    })

    test('send a POST request with incorrect body , it should return status 500', async () => {
      const error = 'Error'
      // arrange: stub the repo function to return a todo object
      vi.spyOn(TodoRepo, 'createTodo')
        .mockRejectedValue(new Error())

      // act: send a POST request to /api/v1/todos
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/todos',
        body: {}
      })

      // assert: response should be status 500
      expect(response.statusCode).toBe(500)

      // assert: response body should be an error message
      expect(response.body).toBe(`[Server Error]: ${error}`)
    })
  })

  describe('[updateTodoStatus] case', () => {
    test('send a PUT request with id and status , it should return status 200', async () => {
      // arrange: stub the repo function to return a todo object
      vi.spyOn(TodoRepo, 'updateTodoById')
        .mockResolvedValue({ id: '1', name: 'Test Todo', description: 'This is a test todo', status: true })

      // act: send a PUT request to /api/v1/todos/{id}
      const response = await server.inject({
        method: 'PUT',
        url: `/api/v1/todos/1`,
        body: { status: true }
      })

      // assert: response should be status 200
      expect(response.statusCode).toBe(200)

      // assert: response body should be a todo object
      expect(response.json()).toMatchObject({
        todo: { id: '1', name: 'Test Todo', description: 'This is a test todo', status: true }
      })
    })

    test('send a PUT request with non-existent id param , it should return status 404', async () => {
      // arrange: stub the repo function to return null
      vi.spyOn(TodoRepo, 'updateTodoById')
        .mockImplementation(async (id: String, update: UpdateQuery<Todo>) => Promise.resolve(null))

      // act: send a PUT request to /api/v1/todos/{id}
      const nonExistentId = 'non-existent-id'
      const response = await server.inject({
        method: 'PUT',
        url: `/api/v1/todos/${nonExistentId}`,
        body: { status: true }
      })

      // assert: response should be status 404
      expect(response.statusCode).toBe(404)

      // assert: response body should return error msg
      expect(response.json()).toMatchObject(
        { "msg": "Not Found Todo:non-existent-id" }
      )
    })

    test('send a PUT request with error , it should return status 500', async () => {
      const error = 'Error'
      // arrange: stub the repo function to return a todo object
      vi.spyOn(TodoRepo, 'updateTodoById')
        .mockRejectedValue(new Error())

      // act: send a PUT request to /api/v1/todos/{id}
      const response = await server.inject({
        method: 'PUT',
        url: `/api/v1/todos/1`,
        body: { status: true }
      })

      // assert: response should be status 500
      expect(response.statusCode).toBe(500)

      // assert: response body should be an error message
      expect(response.body).toBe(`[Server Error]: ${error}`)
    })
  })

  describe('[deleteTodo] case', () => {
    test('send a DELETE request with id , it should return status 204', async () => {
      // arrange: stub the repo function to return a ModifyResult object
      const id = new Types.ObjectId(1);
      vi.spyOn(TodoRepo, 'deleteTodoById')
        .mockResolvedValue({
          ok: 1,
          value: { _id: id, id: '1', name: 'Test Todo', description: 'This is a test todo', status: true }
        })

      // act: send a DELETE request to /api/v1/todos/{id}
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/v1/todos/1`
      })

      // assert: response should be status 204
      expect(response.statusCode).toBe(204)
    })

    // test('send a DELETE request with non-existent id param , it should return status 404', async () => {
    //   // arrange: stub the repo function to return null
    //   vi.spyOn(TodoRepo, 'deleteTodoById')
    //     .mockResolvedValue({
    //       ok: 0,
    //       value: null,
    //       lastErrorObject: { updatedExisting: false }
    //     })

    //   // act: send a DELETE request to /api/v1/todos/{id}
    //   const nonExistentId = 'non-existent-id'
    //   const response = await server.inject({
    //     method: 'DELETE',
    //     url: `/api/v1/todos/${nonExistentId}`
    //   })

    //   // assert: response should be status 404
    //   expect(response.statusCode).toBe(404)

    //   // assert: response body should return error msg
    //   expect(response.json()).toMatchObject(
    //     { "msg": "Not Found Todo:non-existent-id" }
    //   )
    // })

    test('send a DELETE request with error , it should return status 500', async () => {
      const error = 'Error'
      // arrange: stub the repo function to return a todo object
      vi.spyOn(TodoRepo, 'deleteTodoById')
        .mockRejectedValue(new Error())

      // act: send a DELETE request to /api/v1/todos/{id}
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/v1/todos/1`
      })

      // assert: response should be status 500
      expect(response.statusCode).toBe(500)
    })
  })
})