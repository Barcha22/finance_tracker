"use client"
import { 
    CardHeader,
    Card,
    CardAction,
    CardContent,
    CardFooter
 } from "@/components/ui/card"
 import { Button } from "@/components/ui/button"
 import { Label } from "@/components/ui/label"
 import {Input} from "@/components/ui/input"
 import { useState } from "react"
 import { useRouter } from "next/navigation"
 import { loginUser, registerUser } from "@/lib/authService"


export default function Page(){
    const router = useRouter();  //for navigation to routes
    const [isSignIn,setisSignIn] = useState(true); //to construct form accordingly
    //for login
    const [signInForm,setSignInForm]=useState({
      'usernamegmail' : '',
      'password' : '',
    })
    // for signup
    const [registerForm,setRegisterForm]=useState({
      'userName'  : '',
      'email' : '',
      'pass' : ''
    })

    //function to show login or register page accorindgly
    function handleSignUp(){
        setisSignIn(prevVal=>!prevVal);
    }
    //function to signin 
    async function signIn(usernameGmail:string,pass:string){
      const result = await loginUser(usernameGmail, pass);
    
      if(result.success) {
        router.push('/dashboard');
      } else {
        console.log('Error while logging in:', result.error)
      }
    }
    //function to register
    async function signUp(username:string,email:string,password:string){
      const result = await registerUser(username, email, password);
      
      if(result.success) {
        console.log('Registration successful:', result.data);
        setisSignIn(true);
      } else {
        console.log('Error registering:', result.error)
      }
    }

    return(
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/*transition and side content */}
            <div
                className={`absolute top-0 left-0 h-full w-1/2 bg-[#008BFF] p-20 flex items-center justify-center transition-transform duration-500 z-10
                ${isSignIn ?  'translate-x-0 rounded-r-[100px]':'translate-x-full rounded-l-[100px]' }
                `}>
                <h1 className="text-white text-2xl">{
                isSignIn?
                `Welcome Back`:
                `Hello There`
                }</h1>
            </div>

            {/*forms*/}
            {/*for signup*/}
            <div className="relative w-1/2 h-125 flex flex-col justify-center items-center z-20">
                {!isSignIn && 
                <div className="flex justify-center items-center">
                    <Card className=" w-full max-w-md max-h-140">
                        <CardHeader>
                            <CardAction>
                                <Button variant="link" onClick={handleSignUp}>Sign In?</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                          <form>
                            <div className="flex flex-col gap-6">
                              <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="m@example.com"
                                  required
                                  onChange={(val)=>{
                                    setRegisterForm({
                                      ...registerForm,
                                      email:val.target.value
                                    })
                                  }}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  type="username"
                                  placeholder="yourname"
                                  required
                                  onChange={(val)=>{
                                    setRegisterForm({
                                      ...registerForm,
                                      userName:val.target.value
                                    })
                                  }}
                                />
                              </div>
                              <div className="grid gap-2">
                                  <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                  </div>
                                  <Input id="password" type="password" required onChange={(val)=>{setRegisterForm({...registerForm,pass:val.target.value})}}/>
                                  {/*password confirmation*/}
                                  <div className="flex items-center">
                                    <Label htmlFor="confirm password"> re-enter password</Label>
                                  </div>
                                  <Input id="password" type="password" required />
                              </div>
                            </div>
                          </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                          <Button type="submit" className="w-full cursor-pointer" onClick={()=>signUp(registerForm.userName,registerForm.email,registerForm.pass)}>
                            Signup
                          </Button>
                          <Button variant="outline" className="w-full cursor-pointer">
                            Signup with Google
                          </Button>
                        </CardFooter>
                    </Card>
                </div>}    
            </div>
            {/*for login*/}
            <div className="relative w-1/2 h-125 flex flex-col justify-center items-center z-20">
                {isSignIn && 
                <div className="flex justify-center items-center">
                    <Card className=" w-full max-w-sm max-h-100">
                        <CardHeader>
                            <CardAction>
                                <Button variant="link" onClick={handleSignUp}>Sign Up?</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                          <form>
                            <div className="flex flex-col gap-6">
                              <div className="grid gap-2">
                                <Label htmlFor="email">Email or Username</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  required
                                  onChange={(val)=>{
                                    setSignInForm({...signInForm,usernamegmail:val.target.value});
                                  }}
                                />
                              </div>
                              <div className="grid gap-2">
                                <div className="flex items-center">
                                  <Label htmlFor="password">Password</Label>
                                  <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                  >
                                    Forgot your password?
                                  </a>
                                </div>
                                <Input id="password" type="password" required onChange={(val)=>{
                                    setSignInForm({
                                      ...signInForm,
                                      password:val.target.value,
                                    })
                                  }}/>
                              </div>
                            </div>
                          </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                          <Button type="submit" className="w-full cursor-pointer" onClick={()=>signIn(signInForm.usernamegmail,signInForm.password)}>
                            Login
                          </Button>
                          <Button variant="outline" className="w-full cursor-pointer">
                            Login with Google
                          </Button>
                        </CardFooter>
                    </Card>
                </div>}    
            </div>
        </div>
    )
}
