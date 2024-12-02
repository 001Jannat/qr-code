"use client"
import { getSession } from "@/_actions/sessionAction";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function Home() {
    const [qrCodeData, setQrCodeData] = useState("");

    useEffect(() => {
        async function fetchSessionAndGenerateQR() {
            try {
                const sessionId = await getSession();
                const qrCodeURL = await QRCode.toDataURL(sessionId); 
                setQrCodeData(qrCodeURL);
            } catch (error) {
                console.error("Error generating QR code:", error);
            }
        }

        fetchSessionAndGenerateQR();
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div>Hi Jannat</div>
            {qrCodeData ? (
                <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
            ) : (
                <p>Loading QR Code...</p>
            )}
        </div>
    );
}
