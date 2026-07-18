import React, { useState, useEffect } from 'react';
import appwriteService from '../appwrite/config';

// Simple cache to prevent redundant API calls for the same user
const avatarCache = {};

export default function UserAvatar({ userId, name, className }) {
    const [avatarSrc, setAvatarSrc] = useState(null);

    useEffect(() => {
        if (!userId) {
            setAvatarSrc('fallback');
            return;
        }
        
        if (avatarCache[userId]) {
            setAvatarSrc(avatarCache[userId]);
            return;
        }

        appwriteService.getProfile(userId).then(profile => {
            if (profile && profile.avatarId) {
                const src = appwriteService.getFilePreview(profile.avatarId);
                avatarCache[userId] = src;
                setAvatarSrc(src);
            } else {
                avatarCache[userId] = 'fallback';
                setAvatarSrc('fallback');
            }
        }).catch(() => {
            avatarCache[userId] = 'fallback';
            setAvatarSrc('fallback');
        });
    }, [userId]);

    const finalSrc = (avatarSrc && avatarSrc !== 'fallback') 
        ? avatarSrc 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`;

    return (
        <img src={finalSrc} alt={name || 'User'} className={className || "w-full h-full object-cover"} />
    );
}
