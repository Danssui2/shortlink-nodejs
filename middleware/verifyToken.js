const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')

dotenv.config()

const createRefresh = (email, id) => {
  return jwt.sign({
    email: email,
    id: id
  }, process.env.JWT_SECRET_REFRESH, {expiresIn: "15d"})
}

const createAccess = (email, id) => {
  return jwt.sign({
    email: email,
    id: id
  }, process.env.JWT_SECRET_ACCESS, {expiresIn: "2h"})
}

const verifyAccess = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json(req.headers)
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS)
    req.user = decoded
    console.log(decoded)
  } catch (err) {
    return res.status(401).send('Invalid Token or expired. please use refresh token')
  }
  return next()
}

const verifyRefresh = (req, res) => {
  const refreshHeader = req.headers.refresh
  const token = refreshHeader && refreshHeader.split(' ')[1]
  if (!token) return res.status(401).json(req.headers)
  
  const email = req.body.email
  const id = req.body.id
  if (!email && !id) return res.status(401).send('Unauthorized')
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH)
    const newAccess = createAccess(email, id)
    return res.status(201).json({newAccess: newAccess})
  } catch (err) {
    return res.status(401).send('Invalid Token or expired. please re login')
  }
}

module.exports = {
  verifyAccess,
  verifyRefresh,
  createAccess,
  createRefresh,
}