import { useState } from 'react';
import {
    CallControls,
    CallParticipantsList,
    CallingState,
    SpeakerLayout,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import MeetingExitDark from './meetingExit';
import Header from './header';

const MeetingRoom = () => {
    const router = useRouter();
    const [layout, setLayout] = useState('speaker-center');
    const [showParticipants, setShowParticipants] = useState(false);
    const [hasLeft, setHasLeft] = useState(false); 
    const { useCallCallingState, useCallState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const { call } = useCallState();

    if (callingState !== CallingState.JOINED) return <div><MeetingExitDark /> </div>;

    const participants = Object.values(call?.state?.participants || {});

    // Main speaker layout
    const MainSpeaker = () => (
        <div className="flex-1 flex items-center justify-center">
            <SpeakerLayout participantsBarPosition="hidden" />
        </div>
    );

    // Participants slider layout
    const ParticipantsSlider = () => (
        <div className="flex w-full space-x-4 overflow-x-auto p-2 bg-gradient-to-r from-white to-[#0ab39c]">
            {participants.map((participant) => (
                <div
                    key={participant.userId}
                    className="w-32 h-32 flex-shrink-0 rounded-lg bg-gradient-to-r from-white to-[#0ab39c] p-1"
                >
                    <div className="h-full w-full rounded-lg bg-gradient-to-r from-white to-[#0ab39c] flex items-center justify-center">
                        <span className="text-xs text-white text-center">
                            {participant.user?.name || participant.userId}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );


    if (hasLeft) {
        return <MeetingExitDark />;
    }

    return (

        <section className="relative h-screen w-full overflow-hidden text-white bg-gradient-to-r from-white to-[#0ab39c]">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-white to-[#0ab39c] p-1 flex items-center z-10">
            <img
                src="/logo.png"
                alt="Favicon"
                className="w-9 h-9 mr-3"
            />
            <h1
                className="text-3xl font-bold flex-1 text-pretty"
                style={{
                    background: "linear-gradient(to right, #0ab39c, rgb(78, 143, 248), red, yellow, green)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    display: "inline-block",
                }}
            >
                Excelrs
            </h1>
        </div>
    
        {/* Main Content */}
        <div className="relative flex flex-col items-center justify-center h-full">
            {/* Main Speaker */}
            <div className="flex-grow flex w-[55%] items-center justify-center">
                <MainSpeaker />
            </div>
    
            {/* Participants Slider */}
            <div className="absolute bottom-0 left-0 w-full bg-gray-900">
                <ParticipantsSlider />
            </div>
    
            {/* Sidebar for Participants List */}
            <div
                className={`fixed top-1 right-0 h-[calc(100vh-10px)] w-[300px] bg-gray-800 p-3 text-white transition-all duration-300 rounded-md ${
                    showParticipants ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
        </div>
    
        {/* Call Controls */}
        <div className="fixed bottom-0 left-1/2 flex -translate-x-1/2 gap-5">
            <CallControls onLeave={() => setHasLeft(true)} />
    
            <DropdownMenu>
                <div className="flex items-center">
                    <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-gray-900 px-4 py-2 hover:bg-[#4c535b]">
                        <LayoutList size={20} className="text-white" />
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                    {['Speaker-Center', 'Grid'].map((item, index) => (
                        <div key={index}>
                            <DropdownMenuItem onClick={() => setLayout(item.toLowerCase())}>
                                {item}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="border-dark-1" />
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
    
            <button onClick={() => setShowParticipants((prev) => !prev)}>
                <div className="cursor-pointer rounded-2xl bg-gray-900 px-4 py-2 hover:bg-[#4c535b]">
                    <Users size={20} className="text-white" />
                </div>
            </button>
        </div>
    </section>
    
    );
};

export default MeetingRoom;
