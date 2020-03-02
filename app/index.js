module.exports = app => {
  const healthCtrl = require('./controllers/health')(app)
  const paymentsCtrl = require('./controllers/payments')(app)

  const isValidMiddleware = require('./middleware/is-valid')

  app.get('/health', healthCtrl.check)

  app.route('/payments')
    .get(isValidMiddleware, paymentsCtrl.getPayments)
    .post(isValidMiddleware, paymentsCtrl.newPayment)
}
