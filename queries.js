/* 
IMPORTANT NOTE:
In order for this project to work on your local machine, you need to
replace the following 3 lines of code with this:

    const Pool = require('pg').Pool
    const pool = new Pool({
        user: 'user',
        host: 'localhost',
        database: 'database',
        password: 'password',
        port: 5432,
    })

Then, replace all of the values in the "Pool" object with your own PostgreSQL 
configuration details. 
(helpful link: https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/)
*/
const configFile = require('./config-postgres')
const Pool = require('pg').Pool
const pool = new Pool(configFile.configInfo)

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body
  
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
        if (error) {
        throw error
        }
        response.headers = {id: results.rows[0].id}
        response.status(201).send({
            responseMessage: `User added with ID: ${results.rows[0].id}`,
            id: results.rows[0].id
        })
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
            throw error
            }
            response.status(200).send({
                responseMessage: `User modified with ID: ${id}`,
                id: id
            })
        } 
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }