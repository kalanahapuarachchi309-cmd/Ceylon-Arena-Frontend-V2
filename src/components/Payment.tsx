import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment.css';
import { API_ENDPOINTS } from '../config/api';

type PaymentMethod = 'card' | 'bank' | null;

interface PaymentFormData {
  amount: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  transactionId: string;
  slipFile: File | null;
}

type PaymentStatus = 'method-selection' | 'card-form' | 'bank-form' | 'processing' | 'success' | 'error';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationData = location.state as {
    playerName: string;
    email: string;
    phone: string;
    teamName: string;
    game: string;
    password: string;
    promocode?: string;
    leaderAddress: string;
    gameId: string;
    player2Name?: string;
    player2GameId?: string;
    player3Name?: string;
    player3GameId?: string;
    player4Name?: string;
    player4GameId?: string;
  };
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('method-selection');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '1500',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    transactionId: '',
    slipFile: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        slipFile: e.target.files![0]
      }));
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
      alert('Please fill all card details');
      return;
    }

    setPaymentStatus('processing');

    try {
      // First register the user with complete data
      const registerResponse = await fetch(API_ENDPOINTS.USERS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: registrationData.playerName,
          email: registrationData.email,
          password: registrationData.password,
          phone: registrationData.phone,
          promoCode: registrationData.promocode || '',
          leaderAddress: registrationData.leaderAddress,
          game: registrationData.game,
          gameId: registrationData.gameId,
          teamName: registrationData.teamName,
          player2Name: registrationData.player2Name || '',
          player2GameId: registrationData.player2GameId || '',
          player3Name: registrationData.player3Name || '',
          player3GameId: registrationData.player3GameId || '',
          player4Name: registrationData.player4Name || '',
          player4GameId: registrationData.player4GameId || '',
        })
      });

      if (!registerResponse.ok) {
        throw new Error('User registration failed');
      }

      const registerData = await registerResponse.json();

      // Store tokens and user data if provided
      if (registerData.accessToken) {
        localStorage.setItem("accessToken", registerData.accessToken);
        localStorage.setItem("refreshToken", registerData.refreshToken);
        localStorage.setItem("user", JSON.stringify(registerData.user));
      }

      // Then process card payment
      const paymentResponse = await fetch(API_ENDPOINTS.PAYMENTS.CARD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: formData.amount,
          cardNumber: formData.cardNumber,
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          email: registrationData.email,
          playerName: registrationData.playerName,
          teamName: registrationData.teamName,
          game: registrationData.game,
          paymentMethod: 'card'
        })
      });

      if (paymentResponse.ok) {
        setPaymentStatus('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setPaymentStatus('error');
        setErrorMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage('Error processing payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error(error);
    }
  };

  // const handleBankPayment = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.bankName || !formData.accountHolder || !formData.accountNumber || !formData.ifscCode || !formData.transactionId || !formData.slipFile) {
  //     alert('Please fill all bank details and upload payment slip');
  //     return;
  //   }

  //   setPaymentStatus('processing');

  //   try {
  //     // First register the user with complete data
  //     const registerResponse = await fetch('http://localhost:5000/api/v1/users/register', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         playerName: registrationData.playerName,
  //         email: registrationData.email,
  //         password: registrationData.password,
  //         phone: registrationData.phone,
  //         promoCode: registrationData.promocode || '',
  //         leaderAddress: registrationData.leaderAddress,
  //         game: registrationData.game,
  //         gameId: registrationData.gameId,
  //         teamName: registrationData.teamName,
  //         player2Name: registrationData.player2Name || '',
  //         player2GameId: registrationData.player2GameId || '',
  //         player3Name: registrationData.player3Name || '',
  //         player3GameId: registrationData.player3GameId || '',
  //         player4Name: registrationData.player4Name || '',
  //         player4GameId: registrationData.player4GameId || ''
  //       })
  //     });

  //     if (!registerResponse.ok) {
  //       throw new Error('User registration failed');
  //     }

  //     const registerData = await registerResponse.json();
  //     console.log('User registered successfully:', registerData);
  //     const userId = registerData.data.id;

  //     // Then submit bank transfer details with payment slip
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('bankName', formData.bankName);
  //     formDataToSend.append('accountHolder', formData.accountHolder);
  //     formDataToSend.append('accountNumber', formData.accountNumber);
  //     formDataToSend.append('ifscCode', formData.ifscCode);
  //     formDataToSend.append('transactionId', formData.transactionId);
  //     formDataToSend.append('slipFile', formData.slipFile);
  //     formDataToSend.append('userId', userId);
  //     formDataToSend.append('amount', formData.amount);
  //     formDataToSend.append('paymentMethod', 'bank');

  //     const paymentResponse = await fetch('http://localhost:5000/api/v1/payments/bank', {
  //       method: 'POST',
  //       body: formDataToSend
  //     });

  //     if (paymentResponse.ok) {
  //       setPaymentStatus('success');
  //       setTimeout(() => {
  //         onComplete();
  //       }, 3000);
  //     } else {
  //       setPaymentStatus('error');
  //       setErrorMessage('Failed to submit payment slip. Please try again.');
  //     }
  //   } catch (error) {
  //     setPaymentStatus('error');
  //     setErrorMessage('Error submitting payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
  //     console.error(error);
  //   }
  // };

  const handleBankPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.bankName ||
      !formData.accountHolder ||
      !formData.accountNumber ||
      !formData.slipFile
    ) {
      alert('Please fill all bank details and upload payment slip');
      return;
    }

    setPaymentStatus('processing');

    try {
      const formDataToSend = new FormData();

      // 🔹 USER DATA
      formDataToSend.append('playerName', registrationData.playerName);
      formDataToSend.append('email', registrationData.email);
      formDataToSend.append('password', registrationData.password);
      formDataToSend.append('phone', registrationData.phone);
      formDataToSend.append('promoCode', registrationData.promocode || '');
      formDataToSend.append('leaderAddress', registrationData.leaderAddress);
      formDataToSend.append('game', registrationData.game);
      formDataToSend.append('gameId', registrationData.gameId);
      formDataToSend.append('teamName', registrationData.teamName);
      formDataToSend.append('player2Name', registrationData.player2Name || '');
      formDataToSend.append('player2GameId', registrationData.player2GameId || '');
      formDataToSend.append('player3Name', registrationData.player3Name || '');
      formDataToSend.append('player3GameId', registrationData.player3GameId || '');
      formDataToSend.append('player4Name', registrationData.player4Name || '');
      formDataToSend.append('player4GameId', registrationData.player4GameId || '');

      // 🔹 BANK DATA
      formDataToSend.append('bankName', formData.bankName);
      formDataToSend.append('accountHolder', formData.accountHolder);
      formDataToSend.append('accountNumber', formData.accountNumber);
      formDataToSend.append('amount', formData.amount);

      // 🔹 SLIP FILE
      formDataToSend.append('slipFile', formData.slipFile);

      const response = await fetch(
        API_ENDPOINTS.USERS.REGISTER_WITH_BANK,
        {
          method: 'POST',
          body: formDataToSend
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setPaymentStatus('success');

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <button className="btn-back-payment" onClick={() => navigate('/register')} disabled={paymentStatus === 'processing'}>
            ← Back to Registration
          </button>
          <h1 className="payment-title">
            <span className="gradient-text">
              {paymentStatus === 'success' ? 'Registration Successful! 🎉' : 'Complete Payment'}
            </span>
          </h1>
          <p className="payment-subtitle">
            {paymentStatus === 'success'
              ? 'Your registration is complete. Redirecting to home page...'
              : paymentStatus === 'processing'
                ? 'Processing your payment...'
                : paymentStatus === 'error'
                  ? 'Payment Error'
                  : 'Choose your preferred payment method'}
          </p>
        </div>

        {paymentStatus === 'success' ? (
          // Success Page
          <div className="success-container">
            <div className="success-box">
              <div className="success-icon">✓</div>
              <h2>Registration Complete!</h2>
              <p className="success-message">Thank you for completing your registration and payment.</p>

              <div className="success-details">
                <h3>Your Registration Details:</h3>
                <div className="success-item">
                  <span>Player Name:</span>
                  <strong>{registrationData.playerName}</strong>
                </div>
                <div className="success-item">
                  <span>Email:</span>
                  <strong>{registrationData.email}</strong>
                </div>
                <div className="success-item">
                  <span>Team Name:</span>
                  <strong>{registrationData.teamName}</strong>
                </div>
                <div className="success-item">
                  <span>Game:</span>
                  <strong>{registrationData.game?.toUpperCase()}</strong>
                </div>
                <div className="success-item total">
                  <span>Payment Amount:</span>
                  <strong>LKR 1,500</strong>
                </div>
              </div>

              <p className="redirect-message">You will be redirected to your home page in a few seconds...</p>
              <button
                className="btn btn-submit"
                onClick={() => navigate('/')}
                style={{ marginTop: '20px', width: '100%' }}
              >
                Go to Home Page Now
              </button>
            </div>
          </div>
        ) : paymentStatus === 'processing' ? (
          // Processing Page
          <div className="processing-container">
            <div className="processing-box">
              <div className="spinner"></div>
              <h2>Processing Payment...</h2>
              <p>Please wait while we process your payment and complete your registration.</p>
            </div>
          </div>
        ) : paymentStatus === 'error' ? (
          // Error Page
          <div className="error-container">
            <div className="error-box">
              <div className="error-icon">✕</div>
              <h2>Payment Failed</h2>
              <p className="error-message">{errorMessage}</p>
              <button
                className="btn btn-cancel"
                onClick={() => setPaymentStatus('method-selection')}
                style={{ marginTop: '20px' }}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : !paymentMethod ? (
          // Payment Method Selection
          <div className="payment-method-selection">
            <div className="registration-summary">
              <h3>✓ Registration Summary</h3>
              <div className="summary-item">
                <span>👤 Player Name:</span>
                <strong>{registrationData.playerName}</strong>
              </div>
              <div className="summary-item">
                <span>📧 Email:</span>
                <strong>{registrationData.email}</strong>
              </div>
              <div className="summary-item">
                <span>📱 Phone:</span>
                <strong>{registrationData.phone}</strong>
              </div>
              <div className="summary-item">
                <span>🎮 Team Name:</span>
                <strong>{registrationData.teamName}</strong>
              </div>
              <div className="summary-item">
                <span>🎯 Game:</span>
                <strong>{registrationData.game?.toUpperCase()}</strong>
              </div>
              <div className="summary-total">
                <span>💰 Amount to Pay:</span>
                <strong>LKR 1,500</strong>
              </div>
            </div>

            <div className="payment-methods">
              {/* <div 
                className="payment-method-card"
                onClick={() => setPaymentMethod('card')}
              >
                <div className="method-icon">💳</div>
                <h3>Credit/Debit Card</h3>
                <p>Pay instantly with your card</p>
                <button className="btn btn-method">Select Card Payment</button>
              </div> */}

              <div
                className="payment-method-card"
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="method-icon">🏦</div>
                <h3>Bank Transfer</h3>
                <p>Transfer via UPI/Bank Account</p>
                <button className="btn btn-method">Select Bank Transfer</button>
              </div>
            </div>
          </div>
        ) : paymentMethod === 'card' ? (
          // Card Payment Form
          <form className="payment-form" onSubmit={handleCardPayment}>
            <div className="form-header">
              <button
                type="button"
                className="btn-back-method"
                onClick={() => setPaymentMethod(null)}
              >
                ← Back to Methods
              </button>
              <h3>Card Payment Details</h3>
            </div>

            <div className="card-form-container">
              <div className="card-display">
                <div className="card-chip">💳</div>
                <div className="card-number">
                  {formData.cardNumber ? formData.cardNumber.replace(/\d(?=\d{4})/g, '*') : '**** **** **** ****'}
                </div>
                <div className="card-details">
                  <div className="card-holder">
                    <span className="label">CARDHOLDER NAME</span>
                    <span className="value">{formData.cardHolder || 'YOUR NAME'}</span>
                  </div>
                  <div className="card-expiry">
                    <span className="label">EXPIRES</span>
                    <span className="value">{formData.expiryDate || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number *</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardHolder">Cardholder Name *</label>
                <input
                  type="text"
                  id="cardHolder"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (LKR) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="1500"
                  disabled
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-submit">
                  Pay LKR {formData.amount}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setPaymentMethod(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          // Bank Transfer Form
          <form className="payment-form" onSubmit={handleBankPayment}>
            <div className="form-header">
              <button
                type="button"
                className="btn-back-method"
                onClick={() => setPaymentMethod(null)}
              >
                ← Back to Methods
              </button>
              <h3>Bank Transfer Details</h3>
            </div>

            <div className="bank-transfer-container">
              <div className="bank-info-box">
                <h4>Bank Account Details</h4>
                <div className="info-item">
                  <span>Account Holder:</span>
                  <strong>Symphony Event LK</strong>
                </div>
                <div className="info-item">
                  <span>Account Number:</span>
                  <strong>8023860717</strong>
                </div>
                {/* <div className="info-item">
                  <span>IFSC Code:</span>
                  <strong>SBIN0001234</strong>
                </div> */}
                <div className="info-item">
                  <span>Bank Name:</span>
                  <strong>Commercial Bank</strong>
                </div>
                <div className="info-item">
                  <span>Branch:</span>
                  <strong>Anuradhapura</strong>
                </div>
                <div className="info-item">
                  <span>Amount:</span>
                  <strong>LKR 1,500</strong>
                </div>
              </div>

              <hr className="divider" />

              <div className="bank-form-fields">
                <div className="form-group">
                  <label htmlFor="bankName">Your Bank Name *</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter your bank name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="accountHolder">Account Holder Name *</label>
                  <input
                    type="text"
                    id="accountHolder"
                    name="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    placeholder="Enter your account holder name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="accountNumber">Account Number *</label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your account number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="slipFile">Upload Payment Slip *</label>
                  <input
                    type="file"
                    id="slipFile"
                    name="slipFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                  {formData.slipFile && (
                    <p className="file-name">✓ {formData.slipFile.name}</p>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-submit">
                    Submit Payment Slip
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => setPaymentMethod(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Payment;
