
const STORAGE_KEY = "hera_demo_mentorship";
const SESSION_KEY = "hera_mentor_session";

// Akun demo mentor.
// ID harus sama dengan ID mentor pada Mentorship.jsx.
const mentorAccounts = [
  {
    id: "1",
    name: "Mentor Demo A",
    email: "mentora@hera.com",
    password: "mentor123",
    field: "Pengembangan Karier",
    experience: "Berpengalaman dalam pengembangan karier",
  },
  {
    id: "2",
    name: "Mentor Demo B",
    email: "mentorb@hera.com",
    password: "mentor123",
    field: "Entrepreneurship",
    experience: "Berpengalaman dalam kewirausahaan",
  },
  {
    id: "3",
    name: "Mentor Demo C",
    email: "mentorc@hera.com",
    password: "mentor123",
    field: "Teknologi & Digital",
    experience: "Berpengalaman dalam bidang teknologi",
  },
  {
    id: "4",
    name: "Mentor Demo D",
    email: "mentord@hera.com",
    password: "mentor123",
    field: "Public Speaking",
    experience: "Berpengalaman dalam komunikasi dan public speaking",
  },
];

// Mencari akun mentor saat login
export function findMentor(email, password) {
  return mentorAccounts.find(
    (mentor) =>
      mentor.email.toLowerCase() === email.trim().toLowerCase() &&
      mentor.password === password
  );
}

// Mengambil data mentor berdasarkan ID
export function getMentorById(id) {
  return mentorAccounts.find(
    (mentor) => String(mentor.id) === String(id)
  );
}

// Mengambil sesi mentor
export function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

// Menyimpan sesi mentor
export function setSession(mentorId) {
  localStorage.setItem(SESSION_KEY, String(mentorId));
}

// Menghapus sesi mentor
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Mengambil semua permintaan mentoring
export function getRequests() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca data mentoring:", error);
    return [];
  }
}

// Menyimpan permintaan mentoring
export function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

// Mengubah status permintaan
export function updateRequestStatus(requestId, mentorId, status) {
  const requests = getRequests();

  const updatedRequests = requests.map((request) => {
    if (
      String(request.id) === String(requestId) &&
      String(request.mentorId) === String(mentorId)
    ) {
      return {
        ...request,
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    return request;
  });

  saveRequests(updatedRequests);
  return updatedRequests;
}
