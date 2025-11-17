// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
// import { toast } from '@/hooks/useToast';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const { login, isLoading, setUser } = useAuthStore();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       await login(data);
//       toast({
//         title: 'Login successful',
//         description: 'Welcome back to OptiFlow!',
//       });
//       navigate('/dashboard');
//     } catch (error) {
//       toast({
//         title: 'Login failed',
//         description: 'Invalid email or password',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleSkipToDashboard = () => {
//     // Set user as authenticated when skipping
//     setUser({
//       id: 'mock-user-1',
//       email: 'demo@optiflow.com',
//       name: 'Demo User',
//       role: 'production_manager',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });
//     navigate('/dashboard');
//   };

//   return (
//     <div className="flex items-center justify-center py-12 px-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center text-primary">
//             Welcome to OptiFlow
//           </CardTitle>
//           <CardDescription className="text-center">
//             Sign in to manage your production orders
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="your.email@example.com"
//                 {...register('email')}
//                 disabled={isLoading}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 {...register('password')}
//                 disabled={isLoading}
//               />
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password.message}</p>
//               )}
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-2">
//           <div className="text-sm text-center text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-primary hover:underline font-medium">
//               Register here
//             </Link>
//           </div>
//           <div className="text-sm text-center text-gray-600">
//             <button 
//               onClick={handleSkipToDashboard}
//               className="text-primary hover:underline font-medium"
//             >
//               Skip to Dashboard →
//             </button>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }


// import { useState } from "react";
// //import { useAuth } from "@/stores/auth.store";
// import { useAuth } from "@/store/auth.store";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const nav = useNavigate();
//   const { login, loading } = useAuth();

//   // States
//   const [mode, setMode] = useState<"login" | "register">("login");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("customer");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ---------------------------------------------
//   // Validation functions
//   // ---------------------------------------------
//   function validateEmail(email: string): boolean {
//     const pattern = /^[^\s@]+@[^\s@]+\.(com|co|edu|gov)$/i;
//     return pattern.test(email);
//   }

//   function validatePassword(password: string): boolean {
//     // At least 10 chars, one uppercase, one digit, one special char
//     const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
//     return pattern.test(password);
//   }

//   function validatePhone(phone: string): boolean {
//     const pattern = /^\+?\d{7,15}$/; // 7–15 digits, optional +
//     return pattern.test(phone);
//   }

//   // ---------------------------------------------
//   // Login handler
//   // ---------------------------------------------
//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!validateEmail(username)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     if (password.trim().length === 0) {
//       setError("Please enter your password.");
//       return;
//     }

//     try {
//       await login(username, password);
//       setSuccess("Login successful!");
//       nav("/home");
//     } catch {
//       setError("Invalid credentials. Please try again or create an account.");
//     }
//   }

//   // ---------------------------------------------
//   // Registration handler
//   // ---------------------------------------------
//   async function handleRegister(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!validateEmail(username)) {
//       setError("Invalid email format. Must include @ and a valid domain.");
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError(
//         "Password must have at least 10 characters, one uppercase letter, one number, and one symbol."
//       );
//       return;
//     }

//     if (!validatePhone(phone)) {
//       setError("Phone must contain only digits and be 7–15 numbers long.");
//       return;
//     }

//     // Prepare request body
//     const body = {
//       username,
//       password,
//       phone,
//       role: "customer",
//     };

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/users/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         const msg =
//           res.status === 400
//             ? "This email is already registered."
//             : "Registration failed.";
//         setError(msg);
//         return;
//       }

//       setSuccess("Account created successfully! Logging in...");
//       // Auto-login after register
//       await login(username, password);
//       nav("/home");
//     } catch {
//       setError("Failed to register. Please try again.");
//     }
//   }

//   // ---------------------------------------------
//   // UI rendering
//   // ---------------------------------------------
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <Card className="w-full max-w-md">
//         <CardContent className="space-y-5 p-6">
//           <h1 className="text-2xl font-semibold text-center">
//             {mode === "login" ? "Welcome to OptiFlow" : "Create your account"}
//           </h1>

//           {/* ---------------- LOGIN FORM ---------------- */}
//           {mode === "login" && (
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="username">Email</Label>
//                 <Input
//                   id="username"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               {error && <p className="text-sm text-red-600">{error}</p>}
//               {success && <p className="text-sm text-green-600">{success}</p>}

//               <Button type="submit" disabled={loading} className="w-full">
//                 {loading ? "Please wait..." : "Login"}
//               </Button>

//               <p className="text-sm text-center mt-3">
//                 Don’t have an account?{" "}
//                 <button
//                   type="button"
//                   className="underline"
//                   onClick={() => {
//                     setMode("register");
//                     setError("");
//                     setSuccess("");
//                   }}
//                 >
//                   Create one
//                 </button>
//               </p>
//             </form>
//           )}

//           {/* ---------------- REGISTER FORM ---------------- */}
//           {mode === "register" && (
//             <form onSubmit={handleRegister} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="username">Email</Label>
//                 <Input
//                   id="username"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Strong password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <p className="text-xs text-gray-500">
//                   At least 10 characters, one uppercase, one number, and one
//                   symbol.
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   placeholder="+1 555 123 4567"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <select
//                   id="role"
//                   value={role}
//                   disabled
//                   className="w-full border rounded-md h-10 px-3 text-gray-500"
//                 >
//                   <option value="customer">Customer (default)</option>
//                 </select>
//               </div>

//               {error && <p className="text-sm text-red-600">{error}</p>}
//               {success && <p className="text-sm text-green-600">{success}</p>}

//               <Button type="submit" disabled={loading} className="w-full">
//                 {loading ? "Please wait..." : "Register"}
//               </Button>

//               <p className="text-sm text-center mt-3">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   className="underline"
//                   onClick={() => {
//                     setMode("login");
//                     setError("");
//                     setSuccess("");
//                   }}
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// src/pages/auth/LoginPage.tsx
// -----------------------------------------------------------
// Displays a real login and registration interface.
// - If the user already exists, logs in via /auth/token.
// - If not, allows registration via /users/.
// - Validates email, password, and phone number.
// -----------------------------------------------------------

import { useState } from "react";
import { useAuth } from "@/stores/auth.store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const { login, loading } = useAuth();

  // Component state
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------------------------------------
  // EMAIL validation
  // ---------------------------------------------
  function validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.(com|co|edu|gov)$/i;
    return pattern.test(email);
  }

  // ---------------------------------------------
  // PASSWORD validation
  // At least 10 chars, one uppercase, one number, one symbol
  // ---------------------------------------------
  function validatePassword(password: string): boolean {
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
    return pattern.test(password);
  }

  // ---------------------------------------------
  // PHONE validation
  // 7–15 digits, optional +
  // ---------------------------------------------
  function validatePhone(phone: string): boolean {
    const pattern = /^\+?\d{7,15}$/;
    return pattern.test(phone);
  }

  // ---------------------------------------------
  // Helper: clear all fields + messages + token
  // ---------------------------------------------
  function clearForm() {
    setUsername("");
    setPassword("");
    setPhone("");
    setError("");
    setSuccess("");
    localStorage.removeItem("of_token");
  }

  // ---------------------------------------------
  // LOGIN handler
  // ---------------------------------------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(username)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Check if user exists
      const check = await fetch(
        `${import.meta.env.VITE_API_URL}/users/exists?email=${username}`
      );

      if (check.status === 404) {
        setError("User not found. Please create an account first.");
        clearForm();
        return;
      }

      await login(username, password);
      setSuccess("Login successful!");
      nav("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials. Please try again or create an account.");
      setPassword("");
      localStorage.removeItem("of_token");
    }
  }

  // ---------------------------------------------
  // REGISTER handler
  // ---------------------------------------------
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(username)) {
      setError("Invalid email format.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 10 characters long, include one uppercase letter, one number, and one symbol."
      );
      return;
    }
    if (!validatePhone(phone)) {
      setError("Phone must contain only digits (7–15 numbers).");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, phone, role: "customer" }),
      });

      if (!res.ok) {
        setError(
          res.status === 400
            ? "This email is already registered."
            : "Registration failed."
        );
        return;
      }

      setSuccess("Account created successfully! Logging in...");
      await login(username, password);
      nav("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  // ---------------------------------------------
  // JSX rendering
  // ---------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative">

      {/* ---------------------------------------------
          🔥 NEW BUTTON: Go Home
      --------------------------------------------- */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => nav("/")}
          className="
            text-sm font-medium text-primary 
            hover:underline hover:text-primary/70
            transition-colors
          "
        >
          ⬅ Home
        </button>
      </div>

      <Card className="w-full max-w-md shadow-md">
        <CardContent className="space-y-5 p-6">
          <h1 className="text-2xl font-semibold text-center">
            {mode === "login" ? "Sign in to OptiFlow" : "Create your account"}
          </h1>

          {/* Login form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  placeholder="Enter your email"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Please wait..." : "Login"}
              </Button>

              <p className="text-sm text-center mt-3">
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setMode("register");
                    clearForm();
                  }}
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* Registration form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  placeholder="Enter your email"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Strong password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Must have at least 10 characters, one uppercase, one number,
                  and one symbol.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  placeholder="+1 555 123 4567"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Please wait..." : "Register"}
              </Button>

              <p className="text-sm text-center mt-3">
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setMode("login");
                    clearForm();
                  }}
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

