import { useState } from "react"
import Button from "../components/ui/Button"
import InputField from "../components/ui/InputField"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../store/hooks"
import { loginUser } from "../store/features/auth/authSlice"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const minimumLoadingTime = 500; // in milliseconds
    try{
      
      const [] = await Promise.all([
        dispatch(loginUser({email,password})).unwrap(),
        new Promise((resolve) => setTimeout(resolve, minimumLoadingTime))
      ]);
      
      navigate("/dashboard")
    } catch (error) {
      setError("Failed to login. Please check your credentials.")
    } finally { 
    setLoading(false)
    }
  }
  

  return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down">
        <div className="h-2 bg-primary w-full" />
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="!text-gray-800 mb-2">Karibu Tena</h2>
            <h3 className="text-sm font-normal">Ingia kuendelea na MauzoPlus</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Barua Pepe"
              type="email"
              name="email"
              placeholder="email@anuani.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <InputField
              label="Nywila"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button 
              type="submit" 
              className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                   Inapakia...
                </span>
              ) : "Ingia Mfumo"}
            </Button>
          </form>
        </div>
        
        {/* <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-sm !text-gray-500">
             Huna akaunti? <span className="text-primary font-bold cursor-pointer hover:underline">Sajili Biashara</span>
           </p>
        </div> */}
      </div>
    </div>
  )
}

export default Login


// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyAocIHxA_wQEzjDGwQiXlHMl6LeKG0b4mk",
//   authDomain: "icecream-baa51.firebaseapp.com",
//   projectId: "icecream-baa51",
//   storageBucket: "icecream-baa51.firebasestorage.app",
//   messagingSenderId: "472193441416",
//   appId: "1:472193441416:web:a08610980303ca00d5493d",
//   measurementId: "G-11XVLC71P6"
// };


// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);