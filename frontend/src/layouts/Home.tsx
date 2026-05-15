
import { useState } from 'react';
import { LoginComponent } from '../features/users/components/Login';
import { SignupComponent } from '../features/users/components/SignUp';



function Home() {

 const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 rounded-full border border-zinc-200 bg-white/90 p-1 shadow-lg backdrop-blur">
        <button
          onClick={() => setMode("signup")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition cursor-pointer ${
            mode === "signup" ? "bg-black text-white" : "text-zinc-700"
          }`}
        >
          Sign up
        </button>
        <button
          onClick={() => setMode("login")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition cursor-pointer ${
            mode === "login" ? "bg-black text-white" : "text-zinc-700"
          }`}
        >
          Login
        </button>
      </div>

      {mode === "signup" ? <SignupComponent setMode={setMode}  /> : <LoginComponent setMode={setMode} />}
    </div>
  );
}

export default Home
