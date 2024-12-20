'use client';
import { useState, useEffect } from "react";
import { getSession } from "@/_actions/sessionAction";
import { checkLoginStatus } from "@/_actions/checkLoginStatus";
import QRCode from "qrcode";

const useQRCodeSession = () => {
    const [qrCodeData, setQrCodeData] = useState("");
    const [sessionDetails, setSessionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let interval;

        const fetchSessionAndGenerateQR = async () => {
            try {
                const sessionId = await getSession();
                const qrCodeURL = await QRCode.toDataURL(sessionId, {
                    color: {
                        dark: '#0ab39c',
                        light: '#ffffff'
                    }
                });
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
        };

        fetchSessionAndGenerateQR();

        return () => {
            clearInterval(interval);
        };
    }, []);

    return { qrCodeData, sessionDetails, isLoading };
};

export default useQRCodeSession;
