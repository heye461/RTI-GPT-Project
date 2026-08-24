export const RTI_CATEGORIES = {
  roads: {
    id: "roads",
    name: "Roads & Infrastructure",
    defaultDept: "Public Works Department (PWD) / Municipal Corporation",
    description: "For requests related to broken roads, drainage issues, flyover status, and street infrastructure spending.",
    fields: [
      { id: "roadName", label: "Road / Street Name & Location", placeholder: "e.g., Mahatma Gandhi Road, Ward 12, near post office", type: "text" },
      { id: "startDate", label: "Approx. Work Start Date (or when issue started)", placeholder: "e.g., January 2025", type: "text" },
      { id: "municipality", label: "Local Authority / Ward Number", placeholder: "e.g., Ward 14, Zone 3", type: "text" }
    ],
    generateQuestions: (data) => [
      `Please provide a certified copy of the work order, agreement, and schedule of work sanctioned for the construction/repair of the road at ${data.roadName || "[Road Name]"} in ${data.municipality || "[Municipality/Ward]"} completed or active around ${data.startDate || "[Date]"}.`,
      `Please provide the total budget allocated/sanctioned for the road construction/repair work at the aforementioned location, along with the detailed bill payments made to the contractor till date.`,
      `Please provide copies of the completion certificate and material quality test reports submitted by the contractor and approved by the inspecting engineers for the work done at ${data.roadName || "[Road Name]"}.`,
      `If the road work is delayed, incomplete, or damaged within the liability period, please provide details of the action taken (such as notices or fines issued) against the contractor.`,
      `Provide the name, designation, and contact details of the supervising engineers and public officials responsible for inspecting the quality and progress of the work at this location.`
    ]
  },
  passport: {
    id: "passport",
    name: "Passport & Police Verification",
    defaultDept: "Regional Passport Office / District Police Headquarters",
    description: "For delays in passport issuance, pending police verification, or file status updates.",
    fields: [
      { id: "fileNumber", label: "Passport File Number", placeholder: "e.g., TN10738291024", type: "text" },
      { id: "applyDate", label: "Date of Application", placeholder: "e.g., 12th March 2025", type: "text" },
      { id: "policeStation", label: "Local Police Station Name", placeholder: "e.g., Anna Nagar Police Station", type: "text" }
    ],
    generateQuestions: (data) => [
      `Provide the current progress report and official status of my passport application under File Number ${data.fileNumber || "[File Number]"} submitted on ${data.applyDate || "[Apply Date]"}.`,
      `If the police verification report is pending, please state the date on which the request was forwarded to the ${data.policeStation || "[Police Station]"} and the date on which it was received back at the Passport Office.`,
      `If the police verification report has been received, please provide a copy of the report and state the final status of passport processing (whether dispatched, on-hold, or rejected).`,
      `As per citizen charter standards, passport verification should be completed in 21 days. If it is delayed, provide the daily progress sheet listing the names and designations of the officials with whom my file remained during the delay period and the reasons for delay.`,
      `Provide details of the redressal mechanism and next steps I need to take to expedite the passport issuance.`
    ]
  },
  pension: {
    id: "pension",
    name: "Pensions & Social Welfare",
    defaultDept: "Social Welfare Department / pension Office",
    description: "For delay in old-age, widow, or disability pensions, or pending application files.",
    fields: [
      { id: "pensionId", label: "Pension Scheme & ID/Application Number", placeholder: "e.g., Old Age Pension, Ref No: AP/5842", type: "text" },
      { id: "stopMonth", label: "Month/Year when pension stopped or pending since", placeholder: "e.g., October 2025", type: "text" },
      { id: "applicantName", label: "Beneficiary Full Name", placeholder: "e.g., Rajesh Kumar", type: "text" }
    ],
    generateQuestions: (data) => [
      `Please state the official status of the pension application / account under ID ${data.pensionId || "[Pension ID]"} in the name of ${data.applicantName || "[Applicant Name]"}.`,
      `Provide the detailed reasons for the delay, non-disbursement, or stoppage of pension payments starting from ${data.stopMonth || "[Month/Year]"}.`,
      `Provide the copy of the rules/guidelines detailing the maximum processing time allowed for releasing pending pension dues or approving new pension applications under this scheme.`,
      `Provide the names and designations of the officers/clerks who dealt with this file since ${data.stopMonth || "[Month/Year]"} and the duration for which it remained with each official.`,
      `Specify the expected date or timeline by which the outstanding pension amount will be credited to the bank account of the beneficiary.`
    ]
  },
  municipal: {
    id: "municipal",
    name: "Municipal & Sanitation Services",
    defaultDept: "Municipal Corporation / Ward Commissioner's Office",
    description: "For issues regarding garbage collection, streetlights, public water supply, or open sewers.",
    fields: [
      { id: "locality", label: "Locality / Street / Ward Name", placeholder: "e.g., Sector-4 HUDCO Colony, Ward 5", type: "text" },
      { id: "issueType", label: "Core Issue", placeholder: "e.g., Non-functional streetlights / open drainage", type: "text" },
      { id: "duration", label: "Duration of the Issue", placeholder: "e.g., Last 3 months", type: "text" }
    ],
    generateQuestions: (data) => [
      `Provide details of the standard operating schedule and budget allocated for resolving issues of ${data.issueType || "[Issue Type]"} in the locality of ${data.locality || "[Locality]"} for the current financial year.`,
      `Provide the total number of complaints received by the Municipal Corporation regarding ${data.issueType || "[Issue Type]"} in ${data.locality || "[Locality]"} during the period ${data.duration || "[Duration]"}, and provide a report on the action taken on each complaint.`,
      `Provide the name of the contractor/agency and the official contract copy responsible for maintaining municipal services (such as sanitation, streetlights, or drainage) in ${data.locality || "[Locality]"}.`,
      `Provide details of the penalties or warnings, if any, imposed on the contractor or staff for failure to resolve the issues during the last ${data.duration || "[Duration]"}.`,
      `Provide the names, designations, and office phone numbers of the sanitary inspectors, ward engineers, or supervisors who are responsible for oversight in this area.`
    ]
  },
  education: {
    id: "education",
    name: "Education & Exam Evaluation",
    defaultDept: "State Education Board / Public University Office",
    description: "For requests related to marksheets, answer sheet re-evaluations, university delay, or scholarship disbursement.",
    fields: [
      { id: "rollNumber", label: "Roll / Registration Number", placeholder: "e.g., 22BEC0415", type: "text" },
      { id: "examName", label: "Exam Name & Semester", placeholder: "e.g., B.E. Electronics - 4th Sem, April 2025", type: "text" },
      { id: "subjectCode", label: "Subject Name & Code", placeholder: "e.g., Digital Signal Processing (EC8402)", type: "text" }
    ],
    generateQuestions: (data) => [
      `Provide a certified copy of the evaluated answer script for the student with Roll No: ${data.rollNumber || "[Roll Number]"} for the subject ${data.subjectCode || "[Subject]"} in the exam ${data.examName || "[Exam Name]"}.`,
      `Provide a copy of the official answer key/marking scheme utilized by examiners to evaluate the subject paper ${data.subjectCode || "[Subject]"} for the aforementioned examination.`,
      `Provide details on the procedure, timeline, and rules set by the institution for applying for re-evaluation, re-totalling, and procuring copy of answer sheets.`,
      `Provide the dates on which the exam was conducted, when evaluation was completed, and the date of declaration of results.`,
      `If the result or marksheet dispatch is delayed, provide the reasons for the delay and details of the staff/section where the processing is currently pending.`
    ]
  },
  custom: {
    id: "custom",
    name: "Custom (Free-Form Query)",
    defaultDept: "Concerned Public Authority Office",
    description: "For specific queries that do not fit into other categories. Write your query in plain text.",
    fields: [
      { id: "customTopic", label: "Topic of Information", placeholder: "e.g., Land acquisition details, tender allocations", type: "text" }
    ],
    generateQuestions: (data) => [
      `Please provide detailed files, correspondence, and file notes concerning the matter of: ${data.customTopic || "[your topic here]"} during the relevant time period.`,
      `Provide copies of all decisions, guidelines, and minutes of meetings where this matter was discussed or decided by the public authority.`,
      `Provide details of total funds allocated, spent, and remaining for this project/scheme/matter.`,
      `Provide the designation of the officer who is custody of these records under the RTI Act, 2005.`
    ]
  }
};
