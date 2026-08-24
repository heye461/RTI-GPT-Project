import React, { useState, useEffect, useRef } from 'react';
import { RTI_CATEGORIES } from '../utils/templates';
import { generateDraft } from '../utils/ai';
import { 
  Building, 
  HelpCircle, 
  FileText, 
  User, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Plus, 
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function DraftingWizard({ apiKey }) {
  const [step, setStep] = useState(1);
  
  // Step 1: Department Info
  const [govType, setGovType] = useState('central');
  const [department, setDepartment] = useState('');
  const [pioAddress, setPioAddress] = useState('');
  
  // Step 2: Category & Category Fields
  const [category, setCategory] = useState('roads');
  const [categoryFields, setCategoryFields] = useState({});
  
  // Step 3: Raw query & generated questions
  const [customQuery, setCustomQuery] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [isDraftGenerated, setIsDraftGenerated] = useState(false);

  // Step 4: Applicant & Fee Info
  const [applicantName, setApplicantName] = useState('');
  const [applicantAddress, setApplicantAddress] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isBPL, setIsBPL] = useState(false);
  const [bplCardNo, setBplCardNo] = useState('');
  const [bplYear, setBplYear] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ipo');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  // Auxiliary UI states
  const [copied, setCopied] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Pre-fill department name when category changes
  useEffect(() => {
    if (RTI_CATEGORIES[category]) {
      setDepartment(RTI_CATEGORIES[category].defaultDept);
    }
  }, [category]);

  const handleFieldChange = (fieldId, value) => {
    setCategoryFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setGenerationError('');
    try {
      const result = await generateDraft({
        categoryId: category,
        fields: {
          ...categoryFields,
          department
        },
        customQuery,
        apiKey
      });
      
      setQuestions(result.questions);
      if (result.targetDepartment) {
        setDepartment(result.targetDepartment);
      }
      setIsDraftGenerated(true);
      setStep(4); // auto advance to applicant step once generated successfully
    } catch (err) {
      setGenerationError(err.message || 'Failed to generate draft.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addQuestion = () => {
    if (newQuestionText.trim()) {
      setQuestions([...questions, newQuestionText.trim()]);
      setNewQuestionText('');
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  const editQuestion = (index, newValue) => {
    const updated = [...questions];
    updated[index] = newValue;
    setQuestions(updated);
  };

  // Compile formatting of fee details
  const getFeeDetailsText = () => {
    if (isBPL) {
      return `The applicant belongs to the Below Poverty Line (BPL) category. (BPL Card No: ${bplCardNo || 'N/A'}, Issued Year: ${bplYear || 'N/A'}). Hence, no fee is applicable under Section 7(5) of the RTI Act, 2005. A copy of BPL Certificate is attached.`;
    }
    const methods = {
      ipo: 'Indian Postal Order (IPO)',
      dd: 'Demand Draft (DD)',
      court_fee: 'Court Fee Stamp',
      online: 'Online Transaction Receipt'
    };
    return `An application fee of Rs. 10/- has been paid via ${methods[paymentMethod] || paymentMethod} bearing Serial/Ref Number: ${paymentRef || '___________'} dated ${paymentDate || '___________'}.`;
  };

  // Format full letter text
  const generateFullLetter = () => {
    const formattedQuestions = questions.map((q, idx) => `   ${idx + 1}. ${q}`).join('\n');
    return `Date: ${new Date().toLocaleDateString('en-IN')}
Place: __________________

To,
The Public Information Officer (PIO)
${department || 'Public Authority Department'}
${pioAddress || 'Full Department Address'}

Subject: Application for Information under Section 6(1) of the Right to Information Act, 2005.

1. Name of the Applicant: ${applicantName || '________________________'}
2. Postal Address: ${applicantAddress || '________________________________________________'}
3. Contact Details: Phone: ${applicantPhone || 'N/A'} | Email: ${applicantEmail || 'N/A'}
4. Citizenship: The applicant is a citizen of India.
5. Particulars of Information Sought under Section 6(1):
${formattedQuestions || '   (No questions generated yet)'}

6. Time Period: The information relates to records/files around the period mentioned in the query.
7. Fee Payment Details:
   ${getFeeDetailsText()}

8. I state that the information sought does not fall within the restrictions contained in Section 8 or 9 of the RTI Act, 2005, and to the best of my knowledge, it pertains to your office.

Sincerely,


(Signature of Applicant)
${applicantName || '________________________'}`;
  };

  const letterRef = useRef(null);

  const copyToClipboard = () => {
    if (letterRef.current) {
      navigator.clipboard.writeText(letterRef.current.innerText);
    } else {
      navigator.clipboard.writeText(generateFullLetter());
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const stepsList = [
    { num: 1, name: 'Authority', icon: Building },
    { num: 2, name: 'Topic', icon: HelpCircle },
    { num: 3, name: 'Drafting', icon: FileText },
    { num: 4, name: 'Applicant', icon: User },
    { num: 5, name: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Wizard Steps indicator */}
      <div className="mb-8 print:hidden">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          {stepsList.map((s, index) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : isActive 
                        ? 'bg-white border-indigo-600 text-indigo-600 shadow' 
                        : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                    {s.name}
                  </span>
                </div>
                {index < stepsList.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 -mt-6 transition-all ${
                    step > s.num ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Step Content Main area */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between print:p-0 print:border-none">
          <div>
            {/* Step 1: Department Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Step 1: Targeted Public Authority</h3>
                  <p className="text-sm text-slate-500">Specify who should receive your RTI application.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Government Level</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg cursor-pointer flex-1 justify-center bg-slate-50 hover:bg-slate-100/50 transition duration-150">
                        <input 
                          type="radio" 
                          name="govType" 
                          value="central" 
                          checked={govType === 'central'}
                          onChange={() => setGovType('central')}
                          className="text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-sm font-medium text-slate-800">Central Government</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg cursor-pointer flex-1 justify-center bg-slate-50 hover:bg-slate-100/50 transition duration-150">
                        <input 
                          type="radio" 
                          name="govType" 
                          value="state" 
                          checked={govType === 'state'}
                          onChange={() => setGovType('state')}
                          className="text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className="text-sm font-medium text-slate-800">State / Local Government</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Department / Ministry Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Regional Passport Office, Ministry of External Affairs" 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Full Postal Address of PIO Office
                    </label>
                    <textarea 
                      placeholder="Enter the complete office address (including PIN code). A correct address ensures delivery via Speed Post."
                      rows={3}
                      value={pioAddress}
                      onChange={(e) => setPioAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 leading-relaxed flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                    <span>
                      <strong>Tip:</strong> If you are not sure about the exact PIO address, you can address it to 
                      "The Public Information Officer, [Department Name]" and look up their main office address online. Under Section 6(3), if it's the wrong department, they must transfer it to the correct department within 5 days.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Category & Form Fields */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Step 2: Category & Topic Details</h3>
                  <p className="text-sm text-slate-500">Select a category that best describes your request to load template guidelines.</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(RTI_CATEGORIES).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setCategoryFields({});
                      }}
                      className={`p-3 text-left border rounded-xl flex flex-col justify-between transition-all ${
                        category === cat.id
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-800">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-snug">{cat.description}</span>
                    </button>
                  ))}
                </div>

                {/* Dynamic Category Inputs */}
                {RTI_CATEGORIES[category] && RTI_CATEGORIES[category].fields.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 border-b pb-2">
                      Topic Information Details
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {RTI_CATEGORIES[category].fields.map((f) => (
                        <div key={f.id} className="flex flex-col">
                          <label className="text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            value={categoryFields[f.id] || ''}
                            onChange={(e) => handleFieldChange(f.id, e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Raw Query & Generative AI Drafting */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Step 3: AI-Assisted Drafting</h3>
                  <p className="text-sm text-slate-500">Explain your issue in simple words. Our tool will turn it into formal RTI questions.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Describe your problem in plain language
                    </label>
                    <textarea
                      placeholder="e.g. My pension has not been credited since November last year. I submitted the papers to the sub-division officer but haven't received any notification or payment."
                      rows={5}
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* AI Status Badge */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center space-x-2 text-xs">
                      {apiKey ? (
                        <>
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-emerald-700 font-bold">AI Power Mode Active</span>
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                          <span className="text-slate-600 font-medium">Smart Template Mode (Offline-friendly)</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateQuestions}
                      disabled={isGenerating}
                      className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50 transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{isGenerating ? 'Drafting...' : 'Generate Questions'}</span>
                    </button>
                  </div>

                  {generationError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{generationError}</span>
                    </div>
                  )}

                  {/* Editable questions section if already generated */}
                  {questions.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                          Review & Edit Generated Questions
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Click text to modify questions
                        </span>
                      </div>
                      
                      <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                        {questions.map((q, idx) => (
                          <div key={idx} className="flex items-start space-x-2 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition">
                            <span className="text-xs text-slate-400 font-bold mt-1.5 w-4">{idx + 1}.</span>
                            <textarea
                              value={q}
                              onChange={(e) => editQuestion(idx, e.target.value)}
                              rows={2}
                              className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white p-1 rounded text-xs text-slate-700"
                            />
                            <button
                              onClick={() => removeQuestion(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 mt-1 transition"
                              title="Delete Question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new question subform */}
                      <div className="bg-slate-50 p-3 border-t border-slate-200 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add custom question..."
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          className="flex-1 px-3 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={addQuestion}
                          className="p-1.5 bg-slate-200 hover:bg-indigo-600 hover:text-white rounded text-slate-700 transition"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Applicant & Fee Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Step 4: Applicant & Fee Particulars</h3>
                  <p className="text-sm text-slate-500">Provide contact details for the reply and fee payment details.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column: Applicant details */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b pb-1">
                      Applicant Details
                    </h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Applicant Name"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Mailing Address (Complete)</label>
                      <textarea
                        placeholder="Mailing address for official letters"
                        rows={3}
                        value={applicantAddress}
                        onChange={(e) => setApplicantAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                        <input
                          type="text"
                          placeholder="Phone (Optional)"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                        <input
                          type="email"
                          placeholder="Email (Optional)"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fee Details */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b pb-1">
                      Fee Details (Rs. 10)
                    </h4>
                    
                    <label className="flex items-center space-x-2 bg-slate-50 border p-3 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBPL}
                        onChange={(e) => setIsBPL(e.target.checked)}
                        className="text-indigo-600 focus:ring-indigo-500 rounded"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-700 block">Below Poverty Line (BPL) Exemption</span>
                        <span className="text-slate-500">I claim exemption from paying the Rs. 10 application fee.</span>
                      </div>
                    </label>

                    {isBPL ? (
                      <div className="grid grid-cols-2 gap-2 animate-fade-in">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">BPL Card/Certificate No.</label>
                          <input
                            type="text"
                            placeholder="e.g. 19283749"
                            value={bplCardNo}
                            onChange={(e) => setBplCardNo(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Year of Issue</label>
                          <input
                            type="text"
                            placeholder="e.g. 2023"
                            value={bplYear}
                            onChange={(e) => setBplYear(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-fade-in">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                          >
                            <option value="ipo">Indian Postal Order (IPO)</option>
                            <option value="dd">Demand Draft (DD)</option>
                            <option value="court_fee">Court Fee Stamp (State-specific)</option>
                            <option value="online">Online Transaction Receipt</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Receipt / Serial Number</label>
                            <input
                              type="text"
                              placeholder="e.g., 52F 829103"
                              value={paymentRef}
                              onChange={(e) => setPaymentRef(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Date</label>
                            <input
                              type="text"
                              placeholder="e.g., 22/08/2026"
                              value={paymentDate}
                              onChange={(e) => setPaymentDate(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Download */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="print:hidden">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Step 5: Review and Export Application</h3>
                  <p className="text-sm text-slate-500">Your draft letter is complete. Review it below, then print or copy it.</p>
                  
                  {/* Visual helper showing interactive editing */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-3 flex items-start space-x-3 text-indigo-800 animate-fade-in">
                    <Sparkles className="h-5 w-5 shrink-0 text-indigo-600 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold block mb-0.5">Interactive Direct Editing Active</span>
                      <span className="text-indigo-700/90 leading-relaxed">
                        You can click directly inside any part of the letter below and type to customize the text! 
                        Your edits will be preserved when copying or printing to PDF.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Printable Letter container */}
                <div 
                  ref={letterRef}
                  id="printable-letter"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  className="bg-white border border-slate-300 p-8 sm:p-12 shadow-md rounded-xl max-w-2xl mx-auto font-serif text-sm text-black leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}
                    </div>
                    <div>
                      <strong>Place:</strong> __________________
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-bold">To,</p>
                    <p className="font-bold">The Public Information Officer (PIO),</p>
                    <p>{department || '[Department Name]'}</p>
                    <p className="whitespace-pre-line">{pioAddress || '[Department Address]'}</p>
                  </div>

                  <div className="mb-6 font-bold border-b border-black pb-2 text-center text-xs uppercase tracking-wide">
                    Subject: Application for Information under Section 6(1) of the Right to Information Act, 2005.
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="font-bold">1. Full Name of the Applicant:</span> {applicantName || '________________________'}
                    </div>
                    <div>
                      <span className="font-bold">2. Complete Mailing Address:</span>
                      <p className="pl-4 whitespace-pre-line">{applicantAddress || '________________________________________________'}</p>
                    </div>
                    {applicantPhone && (
                      <div>
                        <span className="font-bold">3. Contact Details:</span> Phone: {applicantPhone} {applicantEmail && `| Email: ${applicantEmail}`}
                      </div>
                    )}
                    <div>
                      <span className="font-bold">4. Citizenship:</span> The applicant is a citizen of India.
                    </div>
                    
                    <div>
                      <span className="font-bold">5. Particulars of Information Sought under Section 6(1):</span>
                      <p className="text-xs text-slate-500 italic mt-1 print:hidden">The following structured questions are generated to prevent officer evasiveness:</p>
                      <ol className="list-decimal pl-6 space-y-2 mt-2 font-sans font-medium text-xs leading-relaxed text-slate-900 print:font-serif print:text-sm print:text-black">
                        {questions.map((q, idx) => (
                          <li key={idx} className="pl-1">{q}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <span className="font-bold">6. Time Period:</span> The information relates to records and documents for the period referenced above.
                    </div>

                    <div>
                      <span className="font-bold">7. Application Fee Details:</span>
                      <p className="pl-4 mt-1 leading-snug">{getFeeDetailsText()}</p>
                    </div>

                    <div className="pt-2 text-xs leading-relaxed">
                      8. I state that the information sought does not fall within the restrictions contained in Section 8 or 9 of the RTI Act, 2005, and to the best of my knowledge, it pertains to your office.
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-end">
                    <div className="w-1/2">
                      {isBPL && <p className="text-xs font-sans text-rose-600 print:hidden font-semibold border border-rose-200 p-2 rounded bg-rose-50">* Attach copy of BPL Certificate.</p>}
                    </div>
                    <div className="text-center">
                      <p className="mb-12">Sincerely,</p>
                      <p className="border-t border-slate-400 pt-1 font-sans text-xs w-48 text-center print:border-black font-semibold text-slate-700">
                        (Signature of Applicant)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submitting instructions */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-6 print:hidden">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 border-b pb-2 mb-3">
                    Filing Instructions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <li className="flex items-start">
                      <span className="text-indigo-600 font-bold mr-2">1.</span>
                      <span><strong>Print & Sign:</strong> Print this application, sign it in blue/black ink at the bottom.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 font-bold mr-2">2.</span>
                      <span><strong>Attach Payment:</strong> Securely attach the Postal Order (or DD) of ₹10. (If BPL, attach a copy of the BPL certificate instead).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 font-bold mr-2">3.</span>
                      <span><strong>Mail via Speed Post:</strong> Put it in an envelope, write the PIO's address on it, and send it via <strong>Registered Post</strong> or <strong>Speed Post</strong>. Keep the postal receipt in a safe place.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons at bottom */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8 print:hidden">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div> /* placeholder */
            )}

            <div className="flex space-x-2">
              {step === 5 && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow hover:shadow-indigo-500/10 transition"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Save PDF</span>
                  </button>
                </>
              )}

              {step < 5 && (
                <button
                  onClick={() => {
                    if (step === 3 && questions.length === 0) {
                      // Generate using defaults if they didn't click generate button
                      handleGenerateQuestions();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  className="flex items-center space-x-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow transition"
                >
                  <span>{step === 3 ? 'Generate & Continue' : 'Continue'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Sidebar panel - steps summaries */}
        <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-between print:hidden">
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b pb-2">
              Draft Summary
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">TARGET DEPARTMENT:</span>
                <span className="text-xs text-slate-700 font-bold block truncate" title={department || 'Not specified'}>
                  {department || 'Not specified'}
                </span>
              </div>
              
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">CATEGORY:</span>
                <span className="text-xs text-slate-700 font-bold block">
                  {RTI_CATEGORIES[category] ? RTI_CATEGORIES[category].name : 'Not selected'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">APPLICANT NAME:</span>
                <span className="text-xs text-slate-700 font-bold block truncate">
                  {applicantName || 'Not specified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">FEE MODE:</span>
                <span className="text-xs text-slate-700 font-bold block">
                  {isBPL ? 'Exempted (BPL)' : `${paymentMethod.toUpperCase()}`}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">QUESTIONS IN DRAFT:</span>
                <span className="text-xs text-slate-700 font-bold block">
                  {questions.length} Questions
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-4 text-[10px] text-slate-400 leading-relaxed">
            <strong>Need Help?</strong> Read the <strong>RTI Citizens Guide</strong> from the top navigation bar to check legal definitions and appeal formats.
          </div>
        </div>
      </div>
    </div>
  );
}
