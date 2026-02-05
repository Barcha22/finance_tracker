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


export default function Page(){
    const [isSignIn,setisSignIn] = useState(true);
    const[usernamegmail,setUsernameGmail] = useState('');
    const [password,setPassword] = useState('');

    function handleSignUp(){
        setisSignIn(prevVal=>!prevVal);
    }

    async function signIn(email:string,username:string,pass:string){
      const confirmed=await fetch('http://localhost:3030/auth/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:email,
          username:username,
          password:pass
        })
      })
      if(!confirmed){
        console.log('Error while logging in')
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
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  type="username"
                                  placeholder="yourname"
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                  <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                  </div>
                                  <Input id="password" type="password" required />
                                  {/*password confirmation*/}
                                  <div className="flex items-center">
                                    <Label htmlFor="confirm password"> re-enter password</Label>
                                  </div>
                                  <Input id="confirm password" type="confirm password" required />
                              </div>
                            </div>
                          </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                          <Button type="submit" className="w-full cursor-pointer">
                            Signup
                          </Button>
                          <Button variant="outline" className="w-full cursor-pointer">
                            Signup with Google
                          </Button>
                        </CardFooter>
                    </Card>
                </div>}    
            </div>
           
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
                                <Input id="password" type="password" required />
                              </div>
                            </div>
                          </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                          <Button type="submit" className="w-full cursor-pointer">
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
