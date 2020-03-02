const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const token = jwt.verify(req.headers.authorization, process.env.ENCRYPTION_KEY)

    console.log(token)

    next()
  } catch (err) {
    res.status(403).json({ msg: 'Not authorized' })
  }
}
