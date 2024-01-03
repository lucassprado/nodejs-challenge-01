import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('tasks', search ? {
        title: search,
      } : null)

      return res.end(JSON.stringify(users))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end('Title and description are required.')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end('Title or description are required.')
      }

      try {
        database.update('tasks', id, {
          title,
          description,
          updatedAt: new Date(),
        })
      } catch (error) {
        return res.writeHead(404).end(error.message)
      }

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.update('tasks', id, {
          completedAt: new Date(),
          updatedAt: new Date(),
        })
      } catch (error) {
        return res.writeHead(404).end(error.message)
      }

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.delete('tasks', id)
      } catch (error) {
        return res.writeHead(404).end(error.message)
      }

      return res.writeHead(204).end()
    },
  },
]
