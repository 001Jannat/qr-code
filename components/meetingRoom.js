import { useState } from 'react';
import {
    CallControls,
    CallParticipantsList,
    CallStatsButton,
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

const MeetingRoom = () => {
    const router = useRouter();
    const [layout, setLayout] = useState('speaker-center');
    const [showParticipants, setShowParticipants] = useState(false);
    const { useCallCallingState, useCallState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const { call } = useCallState();

    if (callingState !== CallingState.JOINED) return <div>Loading...</div>;

    const participants = Object.values(call?.state?.participants || {});

    // Main speaker layout
    const MainSpeaker = () => (
        <div className="flex-1 flex items-center justify-center">
            <SpeakerLayout participantsBarPosition="hidden" />
        </div>
    );

    // Participants slider layout
    const ParticipantsSlider = () => (
        <div className="flex w-full space-x-4 overflow-x-auto p-2 bg-[#20242a]">
            {participants.map((participant) => (
                <div
                    key={participant.userId}
                    className="w-32 h-32 flex-shrink-0 rounded-lg bg-gray-700 p-1"
                >
                    <div className="h-full w-full rounded-lg bg-black flex items-center justify-center">
                        <span className="text-xs text-white text-center">
                            {participant.user?.name || participant.userId}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white bg-[#1a1e23]">
            {/* Main Content */}
            <div className="relative flex size-full flex-col items-center justify-center">
                {/* Main Speaker */}
                <div className="flex-grow flex w-[55%]  items-center justify-center">
                    <MainSpeaker />
                </div>

                {/* Participants Slider */}
                <div className="absolute bottom-0 left-0 w-full bg-[#20242a]">
                    <ParticipantsSlider />
                </div>

                {/* Sidebar for Participants List */}
                <div
                    className={`fixed top-0 right-0 h-[calc(100vh-84px)] w-[300px] bg-gray-800 p-3 text-white transition-all duration-300 ${showParticipants ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            </div>

            {/* Call Controls */}
            <div className="fixed bottom-0 left-1/2 flex -translate-x-1/2 gap-5">
                <CallControls onLeave={() => router.push('/')} />

                <DropdownMenu>
                    <div className="flex items-center">
                        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
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

                {/* <CallStatsButton /> */}
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                        <Users size={20} className="text-white" />
                    </div>
                </button>
            </div>
        </section>
    );
};

export default MeetingRoom;
