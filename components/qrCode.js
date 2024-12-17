"use client";
import useQRCodeSession from "./hook";
import Header from "./header";
import Footer from "./footer";
import SessionDetailPage from "./sessionDetails";

const QRCodePage = () => {
    const { qrCodeData, sessionDetails, isLoading } = useQRCodeSession();

    return (
        <div className="min-h-screen">
            {!sessionDetails && <Header />}
            {sessionDetails ? (
                <SessionDetailPage sessionDetails={sessionDetails} />
            ) : (
                <div className="flex flex-col items-center justify-center bg-[#fbf0e3]">
                    <div className="flex flex-col lg:flex-row bg-white border border-black w-[97%] sm:w-[90%] lg:w-[70%] shadow-lg rounded-2xl mt-8 lg:h-[500px]">
                        <div className="flex flex-col w-full lg:w-1/2 px-4 sm:px-8 py-6 sm:py-8 justify-center items-start">
                            <h2 className="text-xl sm:text-3xl font-bold text-black mb-4 sm:mb-6 text-center lg:text-left">
                                Join Your Training using Excelrs Web
                            </h2>
                            <div className="text-black text-base sm:text-lg space-y-3 sm:space-y-4 leading-relaxed">
                                <p>1. Open the app on your phone</p>
                                <p>2. Go to the <strong>Training Section</strong></p>
                                <p>3. Select the training you want to join</p>
                                <p>4. Tap on the <strong>Join Training</strong> option</p>
                                <p>5. Scan the QR code to join the meeting</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center w-full lg:w-1/2 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-black">
                            {isLoading ? (
                                <p className="text-gray-500">Loading QR Code...</p>
                            ) : (
                                <img
                                    src={qrCodeData}
                                    alt="QR Code"
                                    className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 border-4 border-gray-200 shadow-lg rounded-md"
                                />
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
        </div>
    );
};

export default QRCodePage;
