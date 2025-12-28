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
    <div className=" mx-auto mt-4 rounded-md shadow-ld p-6 bg-white/30">
      <h3 className="text-center mt-4 p-4">Login</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button type="submit" variant="primary" >
          {loading? "Ingia..." : "Ingia"}
        </Button>
      </form>
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