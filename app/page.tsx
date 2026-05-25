'use client';

import { useState } from 'react';

interface SerialItem {
  serialNumber: string;
  warrantyStatus: 'In Warranty' | 'Out of Warranty';
  purchaseDate: string;
}

export default function GovernmentBatteryPortal() {
  const [items, setItems] = useState<SerialItem[]>([
    { serialNumber: '', warrantyStatus: 'In Warranty', purchaseDate: '' }
  ]);

  const [modelName, setModelName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState(''); // <-- Added state for email tracking
  const [country, setCountry] = useState('India');
  const [customerNo, setCustomerNo] = useState('');
  const [dealerNo, setDealerNo] = useState('');
  const [address, setAddress] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [pincode, setPincode] = useState('');
  const [problemInSystem, setProblemInSystem] = useState('');
  const [geoLoc, setGeoLoc] = useState<{ lat: number; lng: number } | null>(null);

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  const handleAddItem = () => {
    setItems([...items, { serialNumber: '', warrantyStatus: 'In Warranty', purchaseDate: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof SerialItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const captureLocation = () => {
    if (!navigator.geolocation) return alert('GPS Engine non-responsive or unauthorized.');
    navigator.geolocation.getCurrentPosition((pos) => {
      setGeoLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, () => alert('Unable to safely gather positioning telemetry values.'));
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items, 
          modelName, 
          customerName, 
          userEmail: customerEmail, // <-- Sending the email address to the backend
          country, 
          customerNo,
          dealerNo, 
          address, 
          state: selectedState, 
          district, 
          tehsil, 
          pincode,
          problemInSystem, 
          coordinates: geoLoc
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccessToken(data.ticketId);
        // Reset states upon successful lodging manifest
        setItems([{ serialNumber: '', warrantyStatus: 'In Warranty', purchaseDate: '' }]);
        setModelName('');
        setCustomerName('');
        setCustomerEmail('');
        setCustomerNo('');
        setDealerNo('');
        setAddress('');
        setSelectedState('');
        setDistrict('');
        setTehsil('');
        setPincode('');
        setProblemInSystem('');
        setGeoLoc(null);
      } else {
        alert(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
      alert('An internal network error occurred while routing transaction streams.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f5f9] text-slate-800 font-serif antialiased selection:bg-amber-200">
      
      {/* Top Banner Bar (Standard Government Flag Stripe Layout) */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 h-1.5" />
      
      {/* Official Universal Header Bar */}
      <div className="bg-[#1e3a8a] text-white text-xs px-4 py-1.5 flex justify-between items-center border-b border-blue-900">
        <div className="flex gap-4 font-sans">
          <span>भारत सरकार | Government of India</span>
          <span className="hidden md:inline text-slate-300">| Centralized Equipment Redressal Portal</span>
        </div>
        <div className="flex gap-3 text-[11px] font-sans">
          <button type="button" className="hover:underline">English</button>
          <span>|</span>
          <button type="button" className="hover:underline font-bold">हिन्दी</button>
          <span>|</span>
          <span className="text-amber-400 font-mono">A+</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-6 px-4">
        
        {/* Main Institutional Header Row */}
        <div className="bg-white border border-slate-300 p-6 flex flex-col md:flex-row items-center gap-6 justify-between rounded-t-lg shadow-sm">
          <div className="flex items-center gap-4">
            {/* National Crest Logo Placeholder */}
            <div className="w-14 h-16 bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-center p-1 rounded">
              <span className="text-[10px] uppercase text-slate-400 font-sans tracking-tighter">Official</span>
              <span className="text-xl font-bold text-blue-900 leading-none">⚙️</span>
              <span className="text-[9px] font-bold text-amber-600 font-sans tracking-tight mt-1">EMBLEM</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">राष्ट्रीय बैटरी शिकायत एवं वारंटी पोर्टल</h1>
              <h2 className="text-sm md:text-base font-semibold text-blue-800 font-sans tracking-wide uppercase">National Battery Grievance & System Redressal Registry</h2>
            </div>
          </div>
          <div className="text-center md:text-right font-sans">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Helpline Number</p>
            <p className="text-lg font-bold text-red-600 font-mono">1800-11-2026</p>
            <p className="text-[9px] text-emerald-600 font-medium">Toll-Free | 24x7 System Monitoring</p>
          </div>
        </div>

        {successToken ? (
          <div className="bg-white border-x border-b border-slate-300 p-8 text-center shadow-md rounded-b-lg">
            <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-2xl mb-4 font-sans">✓</div>
            <h2 className="text-xl font-bold text-slate-900">शिकायत सफलतापूर्वक दर्ज की गई / Grievance Logged Successfully</h2>
            <p className="text-sm text-slate-600 mt-2 font-sans">An official tracking dispatch manifest confirmation has been successfully routed via Gmail SMTP framework rules.</p>
            
            <div className="mt-6 p-4 bg-slate-50 border border-slate-300 rounded-lg max-w-md mx-auto">
              <p className="text-xs uppercase tracking-wider font-sans font-bold text-slate-500">Unique Acknowledgment Token ID</p>
              <p className="font-mono text-xl font-bold text-blue-900 mt-1 select-all">{successToken}</p>
            </div>
            
            <button onClick={() => setSuccessToken(null)} className="mt-8 px-6 py-2.5 bg-[#1e3a8a] text-white rounded font-sans text-sm font-semibold hover:bg-blue-800 shadow transition-all">
              Log Alternative Grievance Entry
            </button>
          </div>
        ) : (
          <form onSubmit={handleFormSubmission} className="bg-white border-x border-b border-slate-300 p-6 md:p-8 space-y-8 rounded-b-lg shadow-sm font-sans">
            
            {/* Section 1: Dynamic Battery Stack Asset Tracking */}
            <div className="border border-slate-300 rounded-lg p-5 bg-slate-50/50 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-300 pb-3 gap-2">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">1. Battery Fleet Asset Matrix (बैटरी बेड़ा विवरण)</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddItem} className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 shadow-sm transition-all">
                    + Add New Cell
                  </button>
                </div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-4 border border-slate-300 rounded shadow-sm relative group">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Serial Number / बारकोड संख्या <span className="text-red-600">*</span></label>
                    <input 
                      type="text" required value={item.serialNumber} 
                      onChange={(e) => handleItemChange(index, 'serialNumber', e.target.value)}
                      placeholder="Input factory barcode stamp string"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-600 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">बारकोड पर क्लिक करें और स्कैन करें।</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Warranty Status (वारंटी की स्थिति) <span className="text-red-600">*</span></label>
                    <div className="flex gap-4 pt-1">
                      {['In Warranty', 'Out of Warranty'].map((status) => (
                        <label key={status} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input 
                            type="radio" name={`warranty-${index}`} value={status} checked={item.warrantyStatus === status}
                            onChange={() => handleItemChange(index, 'warrantyStatus', status as any)}
                            className="w-4 h-4 accent-blue-700"
                          />
                          {status === 'In Warranty' ? 'In Warranty (वारंटी के अंतर्गत)' : 'Out of Warranty (वारंटी समाप्त)'}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Date (क्रय तिथि) <span className="text-red-600">*</span></label>
                    <input 
                      type="date" required value={item.purchaseDate}
                      onChange={(e) => handleItemChange(index, 'purchaseDate', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-600 font-sans text-slate-600"
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => handleRemoveItem(index)} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded border border-red-700 flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-700">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Section 2: Core Equipment & Client Details */}
            <div className="border border-slate-300 rounded-lg p-5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">2. Equipment Core Profile & Complainant Bio</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name (ग्राहक का नाम) <span className="text-red-600">*</span></label>
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter full legal registry name" className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (ईमेल पता) <span className="text-red-600">*</span></label>
                <input type="email" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 font-sans"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Battery Model Name (मॉडल का नाम) <span className="text-red-600">*</span></label>
                <select required value={modelName} onChange={(e) => setModelName(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600">
                  <option value="">-- Choose Power Node Subclass --</option>
                  <option value="Lead-Acid Tubular Cell 150AH">Lead-Acid Tubular Cell 150AH</option>
                  <option value="Lithium Iron Phosphate LFP-48V">Lithium Iron Phosphate LFP-48V</option>
                  <option value="Solar Matrix High-Capacity Grid Array">Solar Matrix High-Capacity Grid Array</option>
                  <option value="Industrial UPS Backup Cell-Pack V2">Industrial UPS Backup Cell-Pack V2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country (देश) <span className="text-red-600">*</span></label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600">
                  <option value="India">India</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Bhutan">Bhutan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Mobile No (मोबाइल नंबर) <span className="text-red-600">*</span></label>
                <div className="flex gap-2">
                  <input type="tel" required value={customerNo} onChange={(e) => setCustomerNo(e.target.value)} placeholder="10-digit primary contact node" className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 font-mono"/>
                  
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dealer No / Alternate No (डीलर नंबर / वैकल्पिक नंबर) <span className="text-red-600">*</span></label>
                <input type="text" required value={dealerNo} onChange={(e) => setDealerNo(e.target.value)} placeholder="Specify retail vendor distribution identifier" className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600"/>
              </div>
            </div>

            {/* Section 3: Localization Geometry & Technical Failure Category */}
            <div className="border border-slate-300 rounded-lg p-5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 border-b border-slate-300 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">3. Installation Address & Failure Classification</h3>
                <button type="button" onClick={captureLocation} className="text-xs bg-blue-50 border border-blue-300 text-blue-800 px-3 py-1 rounded font-bold hover:bg-blue-100 transition-all shadow-sm">
                  {geoLoc ? `📍 Telemetry Synced (${geoLoc.lat.toFixed(4)}, ${geoLoc.lng.toFixed(4)})` : "Share Location if at site"}
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Site Address (पता) <span className="text-red-600">*</span></label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Building, Plot or Industrial Grid installation location details" className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State (राज्य) <span className="text-red-600">*</span></label>
                <select required value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600">
                  <option value="">-- Choose State Zone --</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Haryana">Haryana</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District (जिला) <span className="text-red-600">*</span></label>
                <select required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600">
                  <option value="">-- Choose Administrative District --</option>
                  <option value="Gautam Buddha Nagar">Gautam Buddha Nagar</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tehsil (तहसील) <span className="text-red-600">*</span></label>
                <select required value={tehsil} onChange={(e) => setTehsil(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600">
                  <option value="">-- Choose Sub-Division Block --</option>
                  <option value="Sadar">Sadar</option>
                  <option value="Jewar">Jewar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode (पिनकोड) <span className="text-red-600">*</span></label>
                <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="6-digit central index code" className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600 font-mono"/>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Problem In System / शिकायत का प्रकार <span className="text-red-600">*</span></label>
                <select required value={problemInSystem} onChange={(e) => setProblemInSystem(e.target.value)} className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-600">
                  <option value="">-- Choose Power Critical Failure Symptom --</option>
                  <option value="Electrolyte Leakage / Acid Spillage Risk">Electrolyte Leakage / Acid Spillage Risk</option>
                  <option value="Zero Charge Ingestion / Total Voltage Drop">Zero Charge Ingestion / Total Voltage Drop</option>
                  <option value="Abnormal Swelling / Cell Overheating Stack">Abnormal Swelling / Cell Overheating Stack</option>
                  <option value="Inverter Communication / Synchronous Fault Sequence">Inverter Communication / Synchronous Fault Sequence</option>
                </select>
              </div>
            </div>

            {/* Official Declaration Panel */}
            <div className="bg-amber-50 border border-amber-300 p-4 rounded text-xs text-amber-900 leading-relaxed font-sans">
              <strong>Declaration:</strong> I hereby declare that the serial numbers and installation telemetry details provided above are true to the structural context of the equipment deployment. Submitting false data violates consumer warranty code criteria.
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1e3a8a] text-white py-3.5 rounded font-bold tracking-wide transition-all shadow hover:bg-blue-800 disabled:opacity-50 text-sm font-sans uppercase"
            >
              {loading ? "Processing Secure Form Registry Pipeline..." : "Submit Official Complaint Registry Record"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}