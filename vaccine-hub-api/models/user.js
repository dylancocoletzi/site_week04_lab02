const db = require("../db")
const { UnauthorizedError, BadRequestError  } = require("../utils/errors")

class User{
    static async login(credentials){
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials){
        const requireFields = ["email", "password", "first_name", "last_name", "location"]
        requireFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid email.")
        }
        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }
        const lowercasedEmail = credentials.email.toLowerCase()
        const result = await db.query(`
        INSERT INTO users (
            email,
            password,
            first_name,
            last_name,
            location
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, first_name, last_name, location, date;
        `,[lowercasedEmail, credentials.password, credentials.first_name, credentials.last_name, credentials.location])

        const user = result.rows[0]

        return user
    }

    static async fetchUserByEmail(email){
        if(!email){
            throw new BadRequestError("No email provided")
        }
        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }
}

module.exports = User

// id              SERIAL PRIMARY KEY,
// password        TEXT NOT NULL,
// first_name      TEXT NOT NULL,
// last_name       TEXT NOT NULL,
// email           TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
// location        TEXT NOT NULL,
// date            TIMESTAMP NOT NULL DEFAULT NOW()
