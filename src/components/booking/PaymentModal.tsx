import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { useAuth } from '../../context/AuthContext';
import { Booking, PaymentMethod, Payment } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
}) => {
  const { config, submitPayment } = useHostel();
  const { currentUser } = useAuth();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('JazzCash');
  const [transactionId, setTransactionId] = useState('');
  const [senderTitle, setSenderTitle] = useState(booking?.residentName || '');
  const [senderNumber, setSenderNumber] = useState(booking?.phone || '');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const accounts = config.paymentAccounts;
  const amountToPay = booking.totalInitialPayment;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Preset demo receipts for ease of testing in browser
  const demoReceiptOptions = [
    { label: 'Standard Mobile Receipt', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Official 1Link Bank Receipt', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!transactionId.trim()) {
      setErrorMsg('Please enter the official Transaction ID (TID / Reference) from your bank or payment app SMS.');
      return;
    }

    try {
      setSubmitting(true);
      const recipientAcc =
        selectedMethod === 'JazzCash'
          ? accounts.jazzCash.accountNumber
          : selectedMethod === 'Easypaisa'
          ? accounts.easypaisa.accountNumber
          : `${accounts.bankTransfer.bankName} (${accounts.bankTransfer.accountNumber})`;

      const payment = await submitPayment({
        bookingId: booking.id,
        userId: booking.userId || currentUser?.id,
        residentName: booking.residentName,
        amount: amountToPay,
        currency: 'PKR',
        method: selectedMethod,
        transactionId: transactionId.trim(),
        senderAccountTitle: senderTitle,
        senderAccountNumber: senderNumber,
        recipientAccount: recipientAcc,
        receiptImageUrl: receiptUrl || demoReceiptOptions[0].url,
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(payment);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Top */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit Online Payment Proof</h2>
              <p className="text-xs text-slate-400">
                Booking ID: <span className="font-mono text-emerald-400 font-bold">{booking.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 19 CRITICAL BUSINESS RULE NOTICE */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Important Verification Policy (Section 19):</p>
            <p className="mt-0.5">
              Uploading a payment screenshot does <strong>NOT</strong> automatically confirm your booking. Status will transition to <em>"Payment Verification Pending"</em> while hostel accounts reconcile your transaction ID with bank records.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Total Amount to Pay */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Required Initial Amount:</span>
              <p className="text-2xl font-black text-emerald-400">
                PKR {amountToPay.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-xs text-slate-300">
              <p>Room: <strong className="text-white capitalize">{booking.roomTypeId}</strong></p>
              <p>Security Deposit + 1st Month + Food</p>
            </div>
          </div>

          {/* Payment Method Selector (Pakistani Gateways: JazzCash, Easypaisa, Bank Transfer) */}
          <div>
            <label className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-2">
              Select Pakistani Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['JazzCash', 'Easypaisa', 'Bank Transfer'] as PaymentMethod[]).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition cursor-pointer ${
                    selectedMethod === method
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-black text-sm mb-0.5">
                    {method === 'JazzCash' && '🟠 JazzCash'}
                    {method === 'Easypaisa' && '🟢 Easypaisa'}
                    {method === 'Bank Transfer' && '🏦 1Link Bank'}
                  </div>
                  <span className="text-[10px] font-normal text-slate-500">Official Merchant</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Details Box for Selected Method */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            {selectedMethod === 'JazzCash' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">JazzCash Account Title:</span>
                  <strong className="text-slate-900">{accounts.jazzCash.accountTitle}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Mobile Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono text-sm text-slate-900">{accounts.jazzCash.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accounts.jazzCash.accountNumber, 'jc')}
                      className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                      title="Copy Number"
                    >
                      {copiedKey === 'jc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                  {accounts.jazzCash.instructions}
                </p>
              </>
            )}

            {selectedMethod === 'Easypaisa' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Easypaisa Account Title:</span>
                  <strong className="text-slate-900">{accounts.easypaisa.accountTitle}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Mobile / Merchant Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono text-sm text-slate-900">{accounts.easypaisa.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accounts.easypaisa.accountNumber, 'ep')}
                      className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                      title="Copy Number"
                    >
                      {copiedKey === 'ep' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                  {accounts.easypaisa.instructions}
                </p>
              </>
            )}

            {selectedMethod === 'Bank Transfer' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Bank Name:</span>
                  <strong className="text-slate-900">{accounts.bankTransfer.bankName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Account Title:</span>
                  <strong className="text-slate-900">{accounts.bankTransfer.accountTitle}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Account Number:</span>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono text-slate-900">{accounts.bankTransfer.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accounts.bankTransfer.accountNumber, 'acc')}
                      className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                    >
                      {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">IBAN:</span>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono text-[11px] text-slate-900">{accounts.bankTransfer.iban}</strong>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accounts.bankTransfer.iban, 'iban')}
                      className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
                    >
                      {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                  {accounts.bankTransfer.instructions}
                </p>
              </>
            )}
          </div>

          {/* Form Fields: TID, Sender Details, Receipt URL */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                Transaction ID (TID / Ref #) *
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 0928374619 or IBFT-49829"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Found in your JazzCash/Easypaisa SMS or Mobile Banking receipt.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sender Account Title</label>
                <input
                  type="text"
                  value={senderTitle}
                  onChange={(e) => setSenderTitle(e.target.value)}
                  placeholder="Name on sending account"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sender Mobile / Account #</label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="0300-XXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                />
              </div>
            </div>

            {/* Receipt Upload / Demo Simulator */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Upload Payment Screenshot / Receipt *
              </label>
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">
                  Select payment screenshot image (JPG, PNG, PDF up to 10MB)
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {demoReceiptOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReceiptUrl(opt.url)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${
                        receiptUrl === opt.url
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Attach {opt.label}
                    </button>
                  ))}
                </div>
                {receiptUrl && (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Receipt image attached successfully</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 text-xs hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !transactionId}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg ${
                submitting || !transactionId
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 active:scale-98 cursor-pointer'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Submitting Receipt...' : 'Submit Payment for Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
