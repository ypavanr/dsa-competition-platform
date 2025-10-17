import { useState } from "react";

import axios from "axios";


function LandingPage() {
const [studentName, setStudentName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const GATEWAY_URL = "http://localhost:8000";
  const handleStudentLogin = async () => {
    if (!studentName.trim()) {
      setMessage("Please enter your name.");
      return;
    }
        try {
       const response = await axios.post(`${GATEWAY_URL}/student-login`, {
      username: studentName,
    });

      setMessage(response.data.message);
    console.log("Student Token:", response.data.access_token);
    localStorage.setItem("studentToken", response.data.access_token);
    localStorage.setItem("username", studentName);
    console.log(localStorage.getItem("username"))
      
    } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Invalid credentials.";
      setMessage(errMsg);
    } else if (error instanceof Error) {
      setMessage(error.message || "Unexpected error occurred.");
    } else {
      setMessage("Error connecting to the server.");
    }
    console.error(error);
  }
  };

   const handleAdminLogin = async () => {
    if (!adminPassword.trim()) {
      setMessage("Please enter admin password.");
      return;
    }

    try {
      const response = await axios.post(`${GATEWAY_URL}/admin-login`, {
      password: adminPassword,
    });

      setMessage(response.data.message);
    console.log("Admin Token:", response.data.access_token);
    localStorage.setItem("adminToken", response.data.access_token);
      
    } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Invalid credentials.";
      setMessage(errMsg);
    } else if (error instanceof Error) {
      setMessage(error.message || "Unexpected error occurred.");
    } else {
      setMessage("Error connecting to the server.");
    }
    console.error(error);
  }
  };  
const symbols = ["{}", "</>", "λ", "💻", "⚙️", "∑", "∞", "()", "<>", "π","{}", "</>", "λ", "💻", "⚙️", "∑", "∞", "()", "<>", "π"];
  const floatingElements = symbols.map((sym, idx) => {
    const zone = ["left", "right", "bottom"][Math.floor(Math.random() * 3)];
    let top, left;

    if (zone === "left") {
      top = `${Math.random() * 90}%`;
      left = `${Math.random() * 15}%`;
    } else if (zone === "right") {
      top = `${Math.random() * 90}%`;
      left = `${85 + Math.random() * 10}%`;
    } else {
      top = `${85 + Math.random() * 10}%`;
      left = `${Math.random() * 100}%`;
    }

    return (
      <span
        key={idx}
        className="absolute text-4xl opacity-30 select-none animate-float"
        style={{
          top,
          left,
          animationDelay: `${Math.random() * 5}s`,
        }}
      >
        {sym}
      </span>
    );
  });
  return (
    <main className="min-h-screen bg-[#ffff00] flex flex-col">
            <div className="absolute inset-0 pointer-events-none">{floatingElements}</div>
      <header className="pt-8">
        <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-3d text-center">
          Welcome to the{" "}
          <span className="text-white inline-block bg-black px-3 py-1 rounded-md">
            DSA-Practice Platform
          </span>
        </h1>
      </header>

      <section className="mt-20 px-6">
        <p
          className="max-w-3xl mx-auto text-center text-black text-lg md:text-xl leading-relaxed"
          style={{
            textShadow:
              "1px 1px 0 #ffffff80, 2px 2px 0 rgba(0,0,0,0.10)",
          }}
        >
          Kickstart your journey into Data Structures & Algorithms. Solve simple,
          focused problems that sharpen logic, build confidence, and form strong
          problem-solving habits. Write code, run it instantly, see clear verdicts,
          and level up—one challenge at a time.
        </p>
      </section>

      <section className="mt-20 flex-1 flex items-start justify-center px-6">
        <div className="flex flex-col md:flex-row items-start justify-center gap-8">
          <div
            className="w-80 rounded-2xl border border-black bg-white p-5
                        shadow-lg transition-transform duration-300 ease-out
                        hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-center">Admin Login</h2>
            <input
              type="password"
              placeholder="password..."
               value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="mt-4 mb-4 w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex justify-center">
              <button
                onClick={handleAdminLogin}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white
                           hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                Submit
              </button>
            </div>
          </div>

          <div
            className="w-80 rounded-2xl border border-black bg-white p-5
                        shadow-lg transition-transform duration-300 ease-out
                        hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-center">Student Login</h2>
            <input
              type="text"
              placeholder="enter your name..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-4 mb-4 w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex justify-center">
              <button
               onClick={handleStudentLogin}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white
                           hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {message && (
        <p className="text-center text-black font-medium mt-6 mb-10">{message}</p>
      )}
    </main>
  );
}

export default LandingPage;
