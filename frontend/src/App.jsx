import React, { useState } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Ticket from 'lucide-react/dist/esm/icons/ticket';
import QrCode from 'lucide-react/dist/esm/icons/qr-code';
import Search from 'lucide-react/dist/esm/icons/search';
import Plus from 'lucide-react/dist/esm/icons/plus';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import itsaImg from './assets/ITSA.jpeg';
import csiImg from './assets/CSI.jpeg';
import isteImg from './assets/ISTE.jpeg';

const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'The Wizarding Trials',
    organizer: 'ITSA',
    date: '16-10-2026 - 17-10-2026',
    time: '09:00 AM - 05:00 PM',
    location: 'Room 304',
    category: 'Technical',
    description: 'Four magical challenges await! Test your speed, reflexes, precision and wit to prove yourself!',
    image: itsaImg,
    tiers: [
      { id: 't1', name: 'Participate', price: 100, total: 200, booked: 0 }
    ]
  },
  {
    id: 'evt-2',
    title: 'Caesars Gambit',
    organizer: 'CSI',
    date: '16-10-2026 - 17-10-2026',
    time: '09:00 AM - 05:00 PM',
    location: 'Room 318',
    category: 'Technical',
    description: 'Rome is waiting... Claim the throne... or fall into the trap.',
    image: csiImg,
    tiers: [
      { id: 't1', name: 'Participate', price: 100, total: 500, booked: 0 }
    ]
  },
  {
    id: 'evt-3',
    title: 'Rebuild',
    organizer: 'ISTE',
    date: '16-10-2026 - 17-10-2026',
    time: '09:00 AM - 05:00 PM',
    location: 'Room 414',
    category: 'Technical',
    description: 'A machine can be replicated. An engineer cannot.',
    image: isteImg,
    tiers: [
      { id: 't1', name: 'Participate', price: 100, total: 100, booked: 0 }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('browse');
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tickets, setTickets] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment Flow State
  const [bookingStep, setBookingStep] = useState('select'); // 'select' | 'payment'

  // Verification State
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '', organizer: '', date: '', time: '', location: '',
    category: 'Technical', description: '', tierName: 'General Pass', tierPrice: 0, tierCapacity: 100
  });

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!selectedTier) return;
    setBookingStep('payment');
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create new ticket object
      const ticketId = 'TICK-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const newTicket = {
        id: ticketId,
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        date: selectedEvent.date,
        time: selectedEvent.time,
        location: selectedEvent.location,
        tierName: selectedTier.name,
        quantity: quantity,
        totalPaid: selectedTier.price * quantity,
        status: 'VALID',
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Update event seat bookings state
      setEvents(prevEvents => prevEvents.map(evt => {
        if (evt.id === selectedEvent.id) {
          return {
            ...evt,
            tiers: evt.tiers.map(tr => 
              tr.id === selectedTier.id ? { ...tr, booked: tr.booked + quantity } : tr
            )
          };
        }
        return evt;
      }));

      setTickets([newTicket, ...tickets]);
      setIsProcessing(false);
      setSelectedEvent(null);
      setSelectedTier(null);
      setBookingStep('select');
      setActiveTab('my-tickets');
    }, 1500);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const createdEvent = {
      id: 'evt-' + Date.now(),
      title: newEvent.title,
      organizer: newEvent.organizer,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      category: newEvent.category,
      description: newEvent.description,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      tiers: [
        {
          id: 't-' + Date.now(),
          name: newEvent.tierName,
          price: Number(newEvent.tierPrice),
          total: Number(newEvent.tierCapacity),
          booked: 0
        }
      ]
    };

    setEvents([createdEvent, ...events]);
    setNewEvent({
      title: '', organizer: '', date: '', time: '', location: '',
      category: 'Technical', description: '', tierName: 'General Pass', tierPrice: 0, tierCapacity: 100
    });
    setActiveTab('browse');
  };

  const handleVerifyTicket = (e) => {
    e.preventDefault();
    const found = tickets.find(t => t.id.toLowerCase() === ticketInput.trim().toLowerCase());
    if (found) {
      if (found.status === 'VALID') {
        setScanResult({ success: true, message: 'Valid Ticket!', ticket: found });
      } else {
        setScanResult({ success: false, message: 'Ticket has already been redeemed!', ticket: found });
      }
    } else {
      setScanResult({ success: false, message: 'Invalid Ticket ID. Not found in system.', ticket: null });
    }
  };

  const markTicketUsed = (ticketId) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'REDEEMED' } : t));
    setScanResult(prev => prev ? { ...prev, ticket: { ...prev.ticket, status: 'REDEEMED' } } : null);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setSelectedTier(null);
    setBookingStep('select');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('browse')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              UniTicket
            </span>
            <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full ml-1">
              Campus Edition
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'browse' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" /> Explore Events
            </button>
            <button 
              onClick={() => setActiveTab('my-tickets')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 relative ${
                activeTab === 'my-tickets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" /> My Tickets
              {tickets.length > 0 && (
                <span className="bg-purple-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tickets.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Club Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: BROWSE EVENTS */}
        {activeTab === 'browse' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white">MOSAIC</h1>
              <p className="text-slate-400 text-sm mt-1">Sign-up to participate in fun games</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => {
                const totalCap = evt.tiers.reduce((acc, t) => acc + t.total, 0);
                const totalBooked = evt.tiers.reduce((acc, t) => acc + t.booked, 0);
                const isSoldOut = totalBooked >= totalCap;

                return (
                  <div key={evt.id} className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden hover:border-indigo-500/50 transition duration-200 flex flex-col">
                    {/* Image Container with fitted aspect ratio */}
                    <div className="w-full h-56 bg-slate-950 flex items-center justify-center p-2 border-b border-slate-700/50">
                      <img 
                        src={evt.image} 
                        alt={evt.title} 
                        className="max-h-full max-w-full object-contain rounded-lg" 
                      />
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-indigo-400 mb-2">
                          <span className="bg-indigo-950/80 border border-indigo-800/50 px-2.5 py-0.5 rounded-full font-medium">
                            {evt.category}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Building className="w-3 h-3" /> {evt.organizer}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2">{evt.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{evt.description}</p>
                        
                        <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{evt.date} | {evt.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Capacity Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Seats Booked</span>
                            <span>{totalBooked} / {totalCap}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isSoldOut ? 'bg-red-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${Math.min((totalBooked / totalCap) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setSelectedEvent(evt);
                            setSelectedTier(evt.tiers[0]);
                            setBookingStep('select');
                          }}
                          disabled={isSoldOut}
                          className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                            isSoldOut 
                              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {isSoldOut ? 'Sold Out' : 'Select Ticket & Book'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MY TICKETS */}
        {activeTab === 'my-tickets' && (
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">My Passes & Tickets</h1>
            <p className="text-slate-400 text-sm mb-6">Show your digital QR code pass at the event check-in gate.</p>

            {tickets.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/40 rounded-xl border border-slate-800">
                <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-300">No tickets purchased yet</h3>
                <p className="text-sm text-slate-500 mb-4">Browse campus events to claim your passes.</p>
                <button 
                  onClick={() => setActiveTab('browse')}
                  className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition"
                >
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col sm:flex-row">
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            t.status === 'VALID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-700 text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{t.id}</span>
                        </div>
                        <h3 className="font-bold text-base text-white mb-1">{t.eventTitle}</h3>
                        <p className="text-xs text-indigo-400 font-medium mb-3">{t.tierName} ({t.quantity} Pass)</p>
                        
                        <div className="space-y-1 text-xs text-slate-300">
                          <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {t.date} | {t.time}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.location}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-400">
                        <span>Paid: ₹{t.totalPaid}</span>
                        <span>Booked at {t.bookedAt}</span>
                      </div>
                    </div>

                    {/* QR Section */}
                    <div className="bg-slate-900 p-6 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-700 min-w-[160px]">
                      <div className="bg-white p-2 rounded-lg mb-2">
                        <QrCode className="w-20 h-20 text-slate-900" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{t.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLUB / ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <div className="space-y-10">
            {/* Create New Event Section */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" /> Host New Event
              </h2>
              <p className="text-xs text-slate-400 mb-6">Create a club event and configure ticket capacities.</p>

              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Event Title</label>
                  <input 
                    type="text" required placeholder="e.g. Annual CodeSprint"
                    value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Organizer Club / Society</label>
                  <input 
                    type="text" required placeholder="e.g. IEEE Student Branch"
                    value={newEvent.organizer} onChange={e => setNewEvent({...newEvent, organizer: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input 
                    type="date" required
                    value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                  <input 
                    type="text" required placeholder="e.g. 10:00 AM"
                    value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Venue / Location</label>
                  <input 
                    type="text" required placeholder="e.g. Seminar Hall B"
                    value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Tier Settings */}
                <div className="md:col-span-2 bg-slate-900/60 p-4 rounded-lg border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Pass Tier Name</label>
                    <input 
                      type="text" required placeholder="General / VIP"
                      value={newEvent.tierName} onChange={e => setNewEvent({...newEvent, tierName: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Price (₹)</label>
                    <input 
                      type="number" min="0" required
                      value={newEvent.tierPrice} onChange={e => setNewEvent({...newEvent, tierPrice: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Total Seat Capacity</label>
                    <input 
                      type="number" min="1" required
                      value={newEvent.tierCapacity} onChange={e => setNewEvent({...newEvent, tierCapacity: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition">
                    Publish Event
                  </button>
                </div>
              </form>
            </div>

            {/* Ticket Check-In Simulator */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" /> Live Gate Scanner Simulator
              </h2>
              <p className="text-xs text-slate-400 mb-4">Enter a Ticket ID (e.g. TICK-XXX) to simulate gate check-in.</p>

              <form onSubmit={handleVerifyTicket} className="flex gap-2 max-w-md mb-6">
                <input 
                  type="text" required placeholder="Paste Ticket ID..."
                  value={ticketInput} onChange={e => setTicketInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-semibold">
                  Verify Pass
                </button>
              </form>

              {scanResult && (
                <div className={`p-4 rounded-xl border ${scanResult.success ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-red-950/40 border-red-800/60'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {scanResult.success ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span className={`font-bold text-sm ${scanResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scanResult.message}
                    </span>
                  </div>

                  {scanResult.ticket && (
                    <div className="text-xs text-slate-300 space-y-1 mt-2 pt-2 border-t border-slate-800">
                      <p><strong>Event:</strong> {scanResult.ticket.eventTitle}</p>
                      <p><strong>Tier:</strong> {scanResult.ticket.tierName} ({scanResult.ticket.quantity} Pass)</p>
                      <p><strong>Status:</strong> {scanResult.ticket.status}</p>
                      
                      {scanResult.ticket.status === 'VALID' && (
                        <button 
                          onClick={() => markTicketUsed(scanResult.ticket.id)}
                          className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-[11px] font-semibold"
                        >
                          Mark as Admitted
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* TICKET CHECKOUT & PAYMENT MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 relative">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">{selectedEvent.title}</h2>
            <p className="text-xs text-slate-400 mb-4">{selectedEvent.organizer} | {selectedEvent.date}</p>

            {/* STEP 1: TICKET & QUANTITY SELECTION */}
            {bookingStep === 'select' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Select Ticket Tier</label>
                  <div className="space-y-2">
                    {selectedEvent.tiers.map((tier) => {
                      const remaining = tier.total - tier.booked;
                      const isFull = remaining <= 0;

                      return (
                        <div 
                          key={tier.id}
                          onClick={() => !isFull && setSelectedTier(tier)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer flex justify-between items-center ${
                            selectedTier?.id === tier.id 
                              ? 'border-indigo-500 bg-indigo-950/40 text-white' 
                              : isFull 
                              ? 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed'
                              : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{tier.name}</p>
                            <p className="text-[10px] text-slate-400">{remaining} seats left</p>
                          </div>
                          <span className="font-bold text-sm text-indigo-400">
                            {tier.price === 0 ? 'FREE' : `₹${tier.price}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
                  <select 
                    value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value={1}>1 Ticket</option>
                    <option value={2}>2 Tickets</option>
                    <option value={3}>3 Tickets</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-bold text-white">
                      ₹{(selectedTier?.price || 0) * quantity}
                    </span>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
                  >
                    Proceed to Pay <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: QR PAYMENT SCREEN */}
            {bookingStep === 'payment' && (
              <div className="space-y-4">
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">Scan QR Code with any UPI / Payment App</p>
                  <p className="text-xl font-bold text-indigo-400 mb-3">
                    ₹{(selectedTier?.price || 0) * quantity}
                  </p>

                  <div className="bg-white p-4 rounded-xl inline-block shadow-md">
                    <QrCode className="w-36 h-36 text-slate-900" />
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 font-mono">
                    UPI ID: uniticket@{selectedEvent.organizer.toLowerCase()}
                  </p>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Event:</span>
                    <span className="font-medium text-white">{selectedEvent.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pass Type:</span>
                    <span className="font-medium text-white">{selectedTier?.name} ({quantity} Pass)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setBookingStep('select')}
                    disabled={isProcessing}
                    className="w-1/3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-2.5 rounded-lg font-semibold transition"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Payment...
                      </>
                    ) : (
                      'I Have Paid — Get Pass'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component Helper
function Building({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5" />
    </svg>
  );
}