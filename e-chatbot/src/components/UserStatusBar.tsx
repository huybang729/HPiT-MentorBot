import { BookMarked } from 'lucide-react';
import React from 'react'
import { AvatarMenu } from './AvatarMenu';

interface UserStatusBarProps {
    user: any,
    isExpanded: boolean,
    toggleExpand: () => void,
    onLogout: () => void
}

export const UserStatusBar: React.FC<UserStatusBarProps> = ({ user, isExpanded, toggleExpand, onLogout }) => {
    return (
        <div className="flex w-full select-none items-center justify-between px-10 py-2 bg-gray-100 ">
            <div className='flex gap-5'>
                {!isExpanded && (
                    <div className="">
                        <button
                            onClick={toggleExpand}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-300"
                            aria-label="Mở sidebar"
                        >
                            <BookMarked color="black" />
                        </button>
                    </div>
                )}

                <div className="">
                    <img src="./src/assets/vlu_logo.svg" className="h-10 object-contain" alt="Logo" />
                </div>
            </div>
            <AvatarMenu
                avatarUrl="./src/assets/user.jpg"
                username={user?.username || 'User'}
                onLogout={onLogout}
            />
        </div>
    );
}
