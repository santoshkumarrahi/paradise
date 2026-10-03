import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useHostel } from '../../context/HostelContext';
import { api } from '../../services/api';

export const ContactPage: React.FC = () => {
  const { config, addToast } = useHostel();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Admission Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    try {
      setSubmitting(true);
      await api.sendContactMessage(name, phone, email, subject, message);
      setSent(true);
      addToast('success', 'Message Dispatched', 'Hostel warden office received your message and will call shortly.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch {
      addToast('error', 'Error', 'Failed to send message. Please call directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Contact Hostel Administration
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Have questions about room availability, semester fees, or mess packages? Reach out to our admissions and management desk.
          </p>
        </div>

        {/* Section 41 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Column */}
          <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Hostel Profile</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{config.name}</h2>
              <p className="text-xs text-slate-500">{config.tagline}</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Complete Address:</span>
                  <p className="text-slate-600 mt-0.5">{config.address}, {config.area}, {config.city}, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Phone Hotline:</span>
                  <p className="text-slate-600 mt-0.5">
                    <a href={`tel:${config.phone}`} className="text-emerald-700 font-bold hover:underline">{config.phone}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">WhatsApp Admissions:</span>
                  <p className="text-slate-600 mt-0.5">
                    <a
                      href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      {config.whatsapp}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Email Inquiries:</span>
                  <p className="text-slate-600 mt-0.5">
                    <a href={`mailto:${config.email}`} className="text-slate-700 hover:underline">{config.email}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Management & Visit Hours:</span>
                  <p className="text-slate-600 mt-0.5">{config.cleanlinessSchedule ? '08:00 AM – 11:00 PM (Daily)' : '08:00 AM – 11:00 PM'}</p>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${config.phone}`}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>

              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send an Inquiry or Message</h2>
              <p className="text-xs text-slate-500 mt-1">Our administrative warden desk typically replies within 2 hours.</p>
            </div>

            {sent && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our team will contact you on your mobile.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Farhan Zaidi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number (Calling/WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. 2-Seater Room availability"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message / Question *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about room availability, semester fees, check-in rules..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-slate-800 text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting Message...' : 'Send Message to Hostel'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
