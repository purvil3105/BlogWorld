import React from 'react';
import { Heart, MessageCircle, PenTool, UserPlus, Activity } from 'lucide-react';

function ActivityTimeline({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-16 bg-white/50 border border-[var(--color-border-light)] rounded-[24px]">
                <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-[var(--color-secondary-text)] font-medium">No recent activity to show.</p>
            </div>
        );
    }

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart className="w-5 h-5 text-red-500" />;
            case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500" />;
            case 'publish': return <PenTool className="w-5 h-5 text-black" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
            default: return <Activity className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white border border-[var(--color-border-light)] rounded-[24px] p-6 shadow-sm">
            <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                {activities.map((activity, index) => (
                    <div key={activity.$id || index} className="relative pl-8">
                        {/* Timeline dot/icon */}
                        <div className="absolute -left-[17px] top-0 bg-white border border-[var(--color-border-light)] rounded-full p-1.5 shadow-sm">
                            {getIcon(activity.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="pt-1">
                            <p className="text-[var(--color-primary-text)] font-medium font-body text-sm">
                                {activity.message}
                            </p>
                            {activity.createdAt && (
                                <p className="text-xs text-[var(--color-secondary-text)] mt-1">
                                    {formatDate(activity.createdAt)}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ActivityTimeline;
