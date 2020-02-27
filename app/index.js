module.exports = app => {
  const healthCtrl = require('./controllers/health')(app)
  const paymentsCtrl = require('./controllers/payments')(app)

  app.get('/health', healthCtrl.check)

  app.route('/payments')
    .get(paymentsCtrl.getPayments)
    .post(paymentsCtrl.newPayment)
}
