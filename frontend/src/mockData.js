// --- This file has the "un-clubbed" 1-to-1 data ---

// 1. Mock data for the "Head of Student Activities"
export const headOfStudentActivities = {
  id: 100,
  name: 'Dr. Suranjana Gangopadhyay',
  department: 'Head of Student Activities (HSA)',
  committees: ['Oversees all student committees'], // This "committee" is a role
  photo: '/assets/faculty_pics/gango_mam.png' // <-- FIXED PATH
};

// 2. Mock data for the "Live Announcements" (Unchanged)
export const mockAnnouncements = [
  { id: 1, date: 'Oct 30, 2025', title: 'Q4 Budget Submissions Now Open', snippet: 'All committee treasurers must submit their Q4 budget proposals by November 15th for faculty review.' },
  { id: 2, date: 'Oct 28, 2025', title: 'New Reimbursement Policy Update', snippet: 'Please note the new policy update: all food-related expenses now require pre-approval from your faculty advisor. No exceptions.' },
  { id: 3, date: 'Oct 25, 2025', title: 'Technovanza 2026 Portal is Live', snippet: 'Faculty advisors and treasurers for Technovanza can now log in to the portal to begin verifying sponsor income and logging initial expenses.' },
  { id: 4, date: 'Oct 22, 2025', title: 'Welcome to the Committee Coordinator', snippet: 'This new portal is now the official source for all committee financial tracking. Please report any bugs to the Digital VJTI team.'},
  { id: 5, date: 'Oct 20, 2025', title: 'Faculty Advisor Assignments Finalized', snippet: 'The 2025-2026 faculty advisor assignments have been finalized. Please review the new "Faculty Advisors" page for details.'}
];

// 3. Mock data for the "Faculty Advisors" page
// --- FIXED 1-to-1 DUMMY LIST (no "clubbing") ---
// Each professor is now a separate entry in the list.
export const mockFaculty = [
  {
    id: 1,
    name: 'Prof. S.S Lachure',
    department: 'Computer Engineering',
    committees: ['Digital VJTI'], // One committee
    photo: '/assets/faculty_pics/lachure_sir.png' // <-- FIXED PATH
  },
  {
    id: 1.5, // Added new ID
    name: 'Prof Varsha', // New prof
    department: 'Computer Engineering',
    committees: ['DLA'], 
    photo: '/assets/faculty_pics/varsha_mam.png' // <-- FIXED PATH
  },
  {
    id: 2,
    name: 'V.B Suryavanshi',
    department: 'Mechanical Engineering',
    committees: ['SRA'],
    photo: '/assets/faculty_pics/surya_sir.png' // <-- FIXED PATH
  },
  {
    id: 2.5,
    name: 'Prof. Datta Shinde', 
    department: 'Mechanical Engineering',
    committees: ['Pratibimb'], 
    photo: '/assets/faculty_pics/datta_shinde.png' // <-- FIXED PATH
  },
  {
    id: 3,
    name: 'Prof. Mandar Tendolkar',
    department: 'Civil Engineering',
    committees: ['VJTI Racing'], 
    photo: '/assets/faculty_pics/mandar_sir.png' // <-- FIXED PATH
  },
  {
    id: 3.5,
    name: 'Prof. Vikas Vadekar', 
    department: 'Mechanical Engineering', // (Spelling fixed)
    committees: ['Pratibimb'], 
    photo: '/assets/faculty_pics/vikas_vadekar.png' // <-- FIXED PATH
  },
  {
    id: 4,
    name: 'Prof. Sachin Naik',
    department: 'Electronics Engineering',
    committees: ['Aero'],
    photo: '/assets/faculty_pics/sachin_naik.png' // <-- FIXED PATH
  },
  {
    id: 4.5, // Added new ID
    name: 'Prof. B. V. Joshi', // New prof
    department: 'Electronics Engineering',
    committees: ['Technovanza'], // One committee
    photo: '/assets/logos/placeholder.png' // <-- FIXED PATH (Please add a placeholder.png to your logos folder)
 },
  {
    id: 5,
    name: 'Prof. L. N. Gupta',
    department: 'Humanities',
    committees: ['Rangawardhan'], // One committee
    photo: '/assets/logos/placeholder.png' // <-- FIXED PATH
  },
  {
    id: 6,
    name: 'Prof. M. K. Rao',
    department: 'Administration',
    committees: ['Alumni Association'], // One committee
    photo: '/assets/logos/placeholder.png' // <-- FIXED PATH
  },
  {
    id: 7,
    name: 'Prof. D. R. Sahu',
    department: 'Production Engineering',
    committees: ['Synergists'], // One committee
    photo: '/assets/logos/placeholder.png' // <-- FIXED PATH
  },
  {
    id: 8,
    name: 'Prof. V. A. Dixit',
    department: 'Civil Engineering',
    committees: ['Vishwa VJTI'], // One committee
    photo: '/assets/logos/placeholder.png' // <-- FIXED PATH
  },
];