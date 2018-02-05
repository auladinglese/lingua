import * as jwt from 'jsonwebtoken'

const signatureSecret = 'somerandomsecret'

export class OAuthHooks {
  constructor (storage){
    this.storage = storage
  }

  validateClient (credentials, req, cb) {
    cb(null, true)
  }

  async grantUserToken (credentials, req, cb) {
    const user = await this.storage.verifyCredentials(credentials.username, credentials.password)
    if (!user) {
      cb(null, false)
    } else {
      const role = user.claims.find(x => x.name === 'role')

      const payload = {
          name: user.name,
          username: user.username,
          userId: user.id,
          role: role ? role.value : undefined
      }
      const token = jwt.sign(payload, signatureSecret)
      cb(null, token)
    }
  }

  authenticateToken (token, req, cb) {
    try {
      const payload = jwt.verify(token, signatureSecret)
      req.params.user = payload
      cb(null, true)
    } catch (e) {
      cb(null, false)
    }
  }

}

export function mustAuthenticate(role = null) {
  return (req, resp, next) => {
    if (!req.params.user) {
      resp.send(401, {
        message: 'Need to log in to use this endpoint'
      })
      resp.end()
      next(false)
    } else {
      if (role && req.params.user.role !== role) {
        resp.send(403, {
          message: 'You are not authorized to perform this request'
        })
        resp.end()
        next(false)
      } else {
        next()
      }
    }
  }
}
