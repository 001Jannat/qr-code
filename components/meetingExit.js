'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

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
        <div className="min-h-screen bg-gray-900 p-4 relative text-gray-200">
            {/* Timer  */}
            <div className="absolute top-4 left-4 flex items-center gap-3">
                <div className="relative h-12 w-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#3c4043"
                            strokeWidth="4"
                            fill="none"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#8ab4f8"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="126"
                            strokeDashoffset={126 - (progress / 100) * 126}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-gray-200">
                        {timeLeft}
                    </span>
                </div>
                <span className="text-sm font-medium text-gray-300">Returning to home screen</span>
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full max-w-md space-y-8 -mt-20">
                    <div className="text-center space-y-6">
                        <h1 className="text-3xl font-medium text-gray-100">
                            You left the meeting
                        </h1>

                        <div className="flex flex-wrap justify-center gap-3">
                            {/* <Button
                                variant="outline"
                                className="text-blue-700 border-blue-300"
                            >
                                Rejoin
                            </Button> */}
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => window.location.reload()}
                            >
                                Return to home screen
                            </Button>

                        </div>

                        <button className="text-blue-300 hover:underline text-sm">
                            Submit feedback
                        </button>
                    </div>

                    {/* Security info card */}
                    <Card className="p-4 bg-gray-800 border-gray-700">
                        <div className="flex gap-4">
                            <div className="shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-blue-300" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h2 className="font-medium text-gray-100">Your meeting is safe</h2>
                                <p className="text-sm text-gray-400">
                                    No one can join a meeting unless invited or admitted by the host
                                </p>
                                <button className="text-blue-300 hover:underline text-sm">
                                    Learn more
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}