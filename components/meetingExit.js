'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import Footer from './footer'

export default function MeetingExitDark() {
    const [timeLeft, setTimeLeft] = useState(60)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const progress = ((60 - timeLeft) / 60) * 100

    return (
        <div
            className="min-h-screen p-4 relative text-gray-900 flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, white, #0ab39c)',
            }}
        >
            
            <div className="absolute top-4 left-4 flex items-center gap-3">
                <div className="relative h-12 w-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#e0e0e0"
                            strokeWidth="4"
                            fill="none"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#0ab39c"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="126"
                            strokeDashoffset={126 - (progress / 100) * 126}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-gray-900">
                        {timeLeft}
                    </span>
                </div>
                <span className="text-sm font-medium text-gray-600">Returning to home screen</span>
            </div>

         
            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-8 text-center">
                  
                    <img
                        src="/ic_launcher.png"
                        alt="Logo"
                        className="mx-auto h-18 w-18 object-contain"
                    />
                    <h1 className="text-3xl font-medium text-gray-900">You left the meeting</h1>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => window.location.reload()}
                        >
                            Return to home screen
                        </Button>
                    </div>
                    <button className="text-emerald-600 hover:underline text-sm">
                        Submit feedback
                    </button>

                   
                    <Card className="p-4 bg-gray-100 border-gray-300">
                        <div className="flex gap-4">
                            <div className="shrink-0">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-emerald-600" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h2 className="font-medium text-gray-300">Your meeting is safe</h2>
                                <p className="text-sm text-gray-400">
                                    No one can join a meeting unless invited or admitted by the host
                                </p>
                                <button className="text-emerald-600 hover:underline text-sm">
                                    Learn more
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
                <Footer />
            </div>
        </div>
    )
}
