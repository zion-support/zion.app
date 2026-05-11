const { withSentry } = require('./withSentry.cjs');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const { action, amount, currency = 'USD' } = req.body || {};

  if (!action) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Action is required' }));
    return;
  }

  try {
    switch (action) {
      case 'create_payment_intent': {
        if (!amount) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Amount is required for payment intent' }));
          return;
        }

        // Mock payment intent creation
        const paymentIntent = {
          id: `pi_${Date.now()}`,
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          status: 'requires_payment_method',
          client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
        };

        res.statusCode = 200;
        res.end(JSON.stringify({ paymentIntent }));
        break;
      }

      case 'get_balance': {
        // Mock balance retrieval
        const balance = {
          available: 1000.00,
          pending: 0.00,
          currency: currency.toUpperCase()
        };

        res.statusCode = 200;
        res.end(JSON.stringify({ balance }));
        break;
      }

      case 'get_transactions': {
        // Mock transaction history
        const transactions = [
          {
            id: 'tx_1',
            amount: 100.00,
            currency: currency.toUpperCase(),
            type: 'credit',
            description: 'Payment received',
            timestamp: new Date().toISOString()
          },
          {
            id: 'tx_2',
            amount: -50.00,
            currency: currency.toUpperCase(),
            type: 'debit',
            description: 'Service fee',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ];

        res.statusCode = 200;
        res.end(JSON.stringify({ transactions }));
        break;
      }

      default: {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid action' }));
        break;
      }
    }
  } catch (error) {
    console.error('Wallet API error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

module.exports = withSentry(handler);

