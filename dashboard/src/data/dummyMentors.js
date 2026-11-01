
const STORAGE_KEY = "hera_demo_mentors";

const initialMentors = [
  {
    id: "M001",
    name: "Dr. Sarah Putri",
    email: "sarah@hera.com",
    category: "Psikolog",
    specialization: "Kesehatan Mental",
    experience: 5,
    verification: "verified",
    status: "active",
  },
  {
    id: "M002",
    name: "Nadia Rahma",
    email: "nadia.mentor@hera.com",
    category: "Pengembangan Diri",
    specialization: "Public Speaking",
    experience: 4,
    verification: "verified",
    status: "active",
  },
  {
    id: "M003",
    name: "Dina Maharani",
    email: "dina@hera.com",
    category: "Pengembangan Diri",
    specialization: "Karier dan Kepemimpinan",
    experience: 3,
    verification: "pending",
    status: "inactive",
  },
  {
    id: "M004",
    name: "Dr. Maya Lestari",
    email: "maya@hera.com",
    category: "Psikolog",
    specialization: "Manajemen Stres",
    experience: 6,
    verification: "pending",
    status: "inactive",
  },
];

export function getMentors() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : initialMentors;
  } catch {
    return initialMentors;
  }
}

export function saveMentors(mentors) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(mentors)
  );
}
