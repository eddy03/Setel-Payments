module.exports = app => {
  const paymentsModel = require('../models/payments')(app)

  const paymentsCtrl = {}

  paymentsCtrl.getPayments = async (req, res) => {
    try {
      const payment = await paymentsModel.findOne({ where: { orderId: req.query.orderId } })

      res.json(payment)
    } catch (err) {
      res.status(500).json({ msg: 'There is an error' })
    }
  }

  paymentsCtrl.newPayment = async (req, res) => {
    try {
      const payment = await paymentsModel.create({
        orderId: req.body.orderId,
        isSuccess: Math.floor(Math.random() * Math.floor(2)) === 1
      })

      res.json(payment)
    } catch (err) {
      res.status(500).json({ msg: 'There is an error' })
    }
  }

  return paymentsCtrl
}
