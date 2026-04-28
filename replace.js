const fs = require('fs');

let code = fs.readFileSync('frontend/src/pages/UserProfilePage.jsx', 'utf8');

const regex = /function PaymentsTab\(\) \{[\s\S]*?\}\s*(?=function SettingsTab)/;

const newTab = `function PaymentsTab() {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay')
  const [upiId, setUpiId] = useState('')

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl pb-24 relative mx-auto">
      {/* Header section with Security Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">Payment Options</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase mt-4 sm:mt-0">
          <ShieldCheck className="w-4 h-4" />
          100% Secure Checkout
        </div>
      </div>

      <div className="space-y-4">

        {/* Luxe Wallet (Powered by Razorpay) */}
        <div className={\`rounded-2xl backdrop-blur-xl bg-white/5 border transition-all \${selectedMethod === 'wallet' ? 'border-[#2B3FE7] shadow-[0_0_20px_rgba(43,63,231,0.15)]' : 'border-white/10 hover:border-white/20'}\`}>
          <div 
            onClick={() => setSelectedMethod('wallet')}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
               {selectedMethod === 'wallet' ? <CheckCircle2 className="w-6 h-6 text-[#2B3FE7]" /> : <Circle className="w-6 h-6 text-gray-500" />}
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#02042B] to-[#2B3FE7] flex items-center justify-center p-2 shadow-md">
                    <Wallet className="w-5 h-5 text-white" />
                 </div>
                 <div>
                   <p className="text-white font-bold text-base tracking-wide">Luxe Wallet</p>
                   <p className="text-[#2B3FE7] text-xs font-bold tracking-widest uppercase mt-0.5">Powered by Razorpay</p>
                 </div>
               </div>
            </div>
            {selectedMethod !== 'wallet' && <p className="text-white font-black">₹4,500.00</p>}
          </div>

          {selectedMethod === 'wallet' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 sm:ml-14">
               <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Available Balance</p>
                    <p className="text-white text-3xl font-black tracking-tight">₹4,500.00</p>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all bg-[#2B3FE7] text-white hover:shadow-[0_0_20px_rgba(43,63,231,0.6)]">
                    Pay ₹12,499
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* UPI Section */}
        <div className={\`rounded-2xl backdrop-blur-xl bg-white/5 border transition-all \${selectedMethod === 'upi' ? 'border-[#2B3FE7] shadow-[0_0_20px_rgba(43,63,231,0.15)]' : 'border-white/10 hover:border-white/20'}\`}>
          <div 
            onClick={() => setSelectedMethod('upi')}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
               {selectedMethod === 'upi' ? <CheckCircle2 className="w-6 h-6 text-[#2B3FE7]" /> : <Circle className="w-6 h-6 text-gray-500" />}
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-inner border border-white/10">
                    <Smartphone className="w-5 h-5 text-white" />
                 </div>
                 <p className="text-white font-bold text-base tracking-wide">Other UPI Apps</p>
               </div>
            </div>
            <ChevronDown className={\`w-5 h-5 transition-transform \${selectedMethod === 'upi' ? 'text-[#2B3FE7] rotate-180' : 'text-gray-500'}\`} />
          </div>

          {selectedMethod === 'upi' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 sm:ml-14">
               <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">Choose an app</p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* GPay */}
                  <div 
                     onClick={() => setSelectedUpiApp('gpay')}
                     className={\`p-4 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 cursor-pointer \${selectedUpiApp === 'gpay' ? 'border-[#2B3FE7] bg-[#2B3FE7]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}\`}
                  >
                     {selectedUpiApp === 'gpay' ? <div className="w-4 h-4 rounded-full border-[4px] border-[#2B3FE7] bg-white"></div> : <div className="w-4 h-4 rounded-full border border-gray-500"></div>}
                     <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-blue-600 shadow-md">G</div>
                     <span className="text-sm font-bold text-white">GPay</span>
                  </div>

                  {/* PhonePe */}
                  <div 
                     onClick={() => setSelectedUpiApp('phonepe')}
                     className={\`p-4 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 cursor-pointer \${selectedUpiApp === 'phonepe' ? 'border-[#2B3FE7] bg-[#2B3FE7]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}\`}
                  >
                     {selectedUpiApp === 'phonepe' ? <div className="w-4 h-4 rounded-full border-[4px] border-[#2B3FE7] bg-white"></div> : <div className="w-4 h-4 rounded-full border border-gray-500"></div>}
                     <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-md">पे</div>
                     <span className="text-sm font-bold text-white">PhonePe</span>
                  </div>

                  {/* Paytm */}
                  <div 
                     onClick={() => setSelectedUpiApp('paytm')}
                     className={\`p-4 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 cursor-pointer \${selectedUpiApp === 'paytm' ? 'border-[#2B3FE7] bg-[#2B3FE7]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}\`}
                  >
                     {selectedUpiApp === 'paytm' ? <div className="w-4 h-4 rounded-full border-[4px] border-[#2B3FE7] bg-white"></div> : <div className="w-4 h-4 rounded-full border border-gray-500"></div>}
                     <div className="w-6 h-6 rounded-full bg-[#002970] flex items-center justify-center text-[8px] font-black text-white shadow-md">Paytm</div>
                     <span className="text-sm font-bold text-white">Paytm</span>
                  </div>
               </div>

               <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">Or Enter UPI ID</p>
               <div className="flex gap-3">
                 <input 
                   type="text" 
                   placeholder="user@okaxis" 
                   value={upiId}
                   onChange={(e) => setUpiId(e.target.value)}
                   className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#2B3FE7] transition-colors"
                 />
                 <button className="px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all border border-[#2B3FE7] text-[#2B3FE7] hover:bg-[#2B3FE7] hover:text-white hover:shadow-[0_0_15px_rgba(43,63,231,0.4)]">
                    Verify
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Credit/Debit Cards */}
        <div className={\`rounded-2xl backdrop-blur-xl bg-white/5 border transition-all \${selectedMethod === 'card' ? 'border-[#2B3FE7] shadow-[0_0_20px_rgba(43,63,231,0.15)]' : 'border-white/10 hover:border-white/20'}\`}>
          <div 
            onClick={() => setSelectedMethod('card')}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
               {selectedMethod === 'card' ? <CheckCircle2 className="w-6 h-6 text-[#2B3FE7]" /> : <Circle className="w-6 h-6 text-gray-500" />}
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-inner border border-white/10">
                    <CreditCard className="w-5 h-5 text-white" />
                 </div>
                 <p className="text-white font-bold text-base tracking-wide">Credit / Debit / ATM Card</p>
               </div>
            </div>
            <ChevronDown className={\`w-5 h-5 transition-transform \${selectedMethod === 'card' ? 'text-[#2B3FE7] rotate-180' : 'text-gray-500'}\`} />
          </div>

          {selectedMethod === 'card' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 sm:ml-14">
               <div className="space-y-3 mb-6">
                 {/* Saved Card */}
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#2B3FE7]/50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full border border-gray-500"></div>
                     <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center border border-gray-600">
                        <span className="text-white font-black text-[10px] italic">VISA</span>
                     </div>
                     <p className="text-white font-mono text-sm tracking-widest">**** 4242</p>
                   </div>
                   <input type="password" placeholder="CVV" className="w-16 bg-white/10 border border-white/10 rounded px-2 py-1 text-white text-center text-sm outline-none focus:border-[#2B3FE7] transition-colors" />
                 </div>
               </div>
               
               <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-dashed border-white/20 text-xs font-bold uppercase tracking-widest text-[#2B3FE7] hover:border-[#2B3FE7] hover:bg-[#2B3FE7]/10 transition-all">
                 <Plus className="w-4 h-4" /> Add New Card
               </button>
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div className={\`rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 opacity-60 cursor-not-allowed\`}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Circle className="w-6 h-6 text-gray-600" />
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shadow-inner border border-white/5">
                    <Banknote className="w-5 h-5 text-gray-500" />
                 </div>
                 <div>
                   <p className="text-gray-400 font-bold text-base tracking-wide">Cash on Delivery</p>
                   <p className="text-red-400/80 text-xs mt-0.5 font-semibold">Not available for this order</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 backdrop-blur-2xl bg-[#0a0a0a]/80 border-t border-white/10 z-50 flex justify-end items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
             <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Total Amount</p>
             <p className="text-white text-2xl font-black">₹12,499.00</p>
          </div>
          <button className="w-full sm:w-auto px-12 py-4 rounded-full text-sm font-black tracking-widest uppercase transition-all bg-[#2B3FE7] text-white shadow-[0_0_30px_rgba(43,63,231,0.4)] hover:shadow-[0_0_40px_rgba(43,63,231,0.6)] hover:bg-blue-600">
             PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  )
}
`;

code = code.replace(regex, newTab);
fs.writeFileSync('frontend/src/pages/UserProfilePage.jsx', code);
console.log('Success');
