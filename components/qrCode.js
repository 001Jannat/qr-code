'use client';

import { getSession } from "@/_actions/sessionAction";
import { checkLoginStatus } from "@/_actions/checkLoginStatus"; 
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import SessionDetailPage from "./sessionDetails";


export default function QRCodePage() {
    const [qrCodeData, setQrCodeData] = useState(""); 
    const [sessionDetails, setSessionDetails] = useState(null); 
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        let interval;  

        async function fetchSessionAndGenerateQR() {
            try {
                const sessionId = await getSession(); 
                const qrCodeURL = await QRCode.toDataURL(sessionId); 
                setQrCodeData(qrCodeURL); 
                setIsLoading(false); 
                interval = setInterval(async () => { 
                    try {
                        const status = await checkLoginStatus(sessionId); 
                        if (status) {
                            clearInterval(interval); 
                            setSessionDetails(status);
                        }
                    } catch (error) {
                        console.error("Error checking login status:", error);
                    }
                }, 2000); 
            } catch (error) {
                console.error("Error generating QR code:", error);
                setIsLoading(false);
            }
        }

        fetchSessionAndGenerateQR();

        return () => {
            clearInterval(interval);  
        };
    }, []); 

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div>Welcome</div>

            {isLoading ? (
                <p>Loading QR Code..</p>
            ) : sessionDetails ? (
              
                <SessionDetailPage sessionDetails={sessionDetails} />
            ) : (
              
                <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
            )}
        </div>
    );
}
