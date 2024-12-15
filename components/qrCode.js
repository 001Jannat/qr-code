"use client";
import useQRCodeSession from "./hook";
import Header from "./header";
import Footer from "./footer";
import SessionDetailPage from "./sessionDetails";

const QRCodePage = () => {
    const { qrCodeData, sessionDetails, isLoading } = useQRCodeSession();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbf0e3]">
            <Header />
            {sessionDetails ? (

                <SessionDetailPage sessionDetails={sessionDetails} />
            ) : (
                <div className="flex bg-white border border-black w-[97%] sm:w-[65%] h-[500px] shadow-lg rounded-2xl mt-8">
                    {/* Left side content (instructions) */}
                    <div className="flex flex-col w-full sm:w-1/2 p-8 justify-center">
                        <h2 className="text-3xl font-bold text-black mb-6">Join Your Training using Excelrs Web</h2>
                        <div className="text-black text-2xl space-y-4 leading-relaxed">
                            <p>1. Open the app on your phone</p>
                            <p>2. Go to the <strong>Training Section</strong></p>
                            <p>3. Select the training you want to join</p>
                            <p>4. Tap on the <strong>Join Training</strong> option</p>
                            <p>5. Scan the QR code to join the meeting</p>
                        </div>
                    </div>

                    {/* Right side content (QR Code) */}
                    <div className="flex items-center justify-center w-full sm:w-1/2 p-6 border-l border-black">
                        {isLoading ? (
                            <p className="text-gray-500">Loading QR Code...</p>
                        ) : (
                            <img
                                src={qrCodeData}
                                alt="QR Code"
                                className="w-80 h-80 border-4 border-gray-200 shadow-lg rounded-md"
                            />
                        )}
                    </div>
                </div>

            )}
            <Footer />
        </div>
    );
};

export default QRCodePage;
