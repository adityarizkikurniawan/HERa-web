
const STORAGE_KEY = "hera_demo_accounts";

export const demoAccounts = [
  {
    id: 1,
    name: "Lintang",
    email: "user@hera.com",
    password: "demo123",
    role: "user",
  },
  {
    id: 2,
    name: "Admin HERa",
    email: "admin@hera.com",
    password: "demo123",
    role: "admin",
  },
  {
    id: 3,
    name: "Dr. Swono",
    email: "psikolog@hera.com",
    password: "demo123",
    role: "psikolog",
  },
];

export function getAccounts() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return [...demoAccounts, ...saved];
  } catch {
    return [...demoAccounts];
  }
}

export function registerUser(user) {
  const accounts = getAccounts();

  const email = user.email.trim().toLowerCase();

  if (accounts.some((account) => account.email === email)) {
    return {
      success: false,
      message: "Email sudah terdaftar.",
    };
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: user.name.trim(),
    email,
    password: user.password,
    role: "user",
  };

  const saved = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...saved, newUser])
  );

  return { success: true };
}


const STATUS_KEY = "hera_demo_user_status";

export function getUserStatus(id) {
  try {
    const statuses = JSON.parse(
      localStorage.getItem(STATUS_KEY) || "{}"
    );

    return statuses[String(id)] || "active";
  } catch {
    return "active";
  }
}

export function updateUserStatus(id, status) {
  if (!["active", "inactive"].includes(status)) {
    return false;
  }

  try {
    const statuses = JSON.parse(
      localStorage.getItem(STATUS_KEY) || "{}"
    );

    statuses[String(id)] = status;

    localStorage.setItem(
      STATUS_KEY,
      JSON.stringify(statuses)
    );

    return true;
  } catch {
    return false;
  }
}
