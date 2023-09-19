import { createServer } from 'node:http'
import { json } from './middleware/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extractQueryParams.js'

const port = 3004

export const server = createServer(async (req, res)=> {
  const { method, url} = req
  
  await json(req,res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups 

    req.params = params
    req.query = query ? extractQueryParams(req.query) : {}

    return route.handler(req, res)
  }
  return res.writeHead(404).end()  
})

server.listen(port)
console.log('Server listening on port ' + port)
