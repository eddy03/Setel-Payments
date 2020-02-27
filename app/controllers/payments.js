module.exports = app => {
  const paymentsCtrl = {}

  paymentsCtrl.getPayments = (req, res) => {
    res.json([])
  }

  paymentsCtrl.newPayment = (req, res) => {
    res.json({ id: 1, status: true })
  }

  return paymentsCtrl
}
