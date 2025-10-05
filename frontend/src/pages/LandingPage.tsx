function LandingPage() {
  return (
    <main className="min-h-screen bg-[#ffff00] flex flex-col">
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
              className="mt-4 mb-4 w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex justify-center">
              <button
                type="submit"
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
              className="mt-4 mb-4 w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white
                           hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
