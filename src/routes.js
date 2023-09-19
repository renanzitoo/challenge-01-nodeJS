import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/buildRoutePath.js' 

const database = new Database()

let date = new Date()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {id, title, description,} = req.body

      if(!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'title and description are required'})
        )
      }

      if(!title){
        return res.writeHead(400).end(
          JSON.stringify({message: 'title is required'})
        )
      }

      if(!description){
        return res.writeHead(400).end(
          JSON.stringify({message: 'description is required'})
        )
      }
      
      const tasks = {
        id: randomUUID(),
        title, 
        description,
        completed_at: null,
        isComplete: false,
        created_at: date,
        updated_at: date,
      }

      database.insert('tasks', tasks)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) =>{
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        id : search,
        title: search,
        description: search,
        completed_at: search,
        created_at: search,
        updated_at: search    
      }: null)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const [task] = database.select('tasks', { id })

      if(!task){
        return res.writeHead(404).end()
      }
      
      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PUT', 
    path: buildRoutePath('/tasks/:id'),
    handler : (req, res) => {
      const { id } = req.params

      const { title, description } = req.body

      const [task] = database.select('tasks', { id })

      if(!task){
        return res.writeHead(404).end()
      }

      if(!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({message: 'title and description are required'})
        )
      }

      if(!title){
        return res.writeHead(400).end(
          JSON.stringify({message: 'title is required'})
        )
      }

      if(!description){
        return res.writeHead(400).end(
          JSON.stringify({message: 'description is required'})
        )
      }

      database.update('tasks', id, {
        title, 
        description,
        updated_at: date
      })
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      database.update('tasks', id, {
        isComplete: true,
        completed_at: date
      })
      return res.writeHead(204).end() 
    }
  }
]