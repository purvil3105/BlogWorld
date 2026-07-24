import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import UserAvatar from './UserAvatar'

function Postcard({ $id, slug, title, featuredimage, authorName, date, readTime, category, userId, createdAt, content }) {
    const displayDate = date || (createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent');
    const wordCount = content ? content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const calculatedReadTime = Math.ceil(wordCount / 200) + ' min read';
    const displayReadTime = readTime || (wordCount > 0 ? calculatedReadTime : '6 min read');

    return (
        <Link to={`/post/${slug || $id}`} className="group block h-full">
            <div className='w-full h-full bg-[var(--color-card-bg)] rounded-[24px] p-4 border border-[var(--color-border-light)] hover-lift flex flex-col'>
                <div className='w-full aspect-[4/3] mb-5 rounded-2xl overflow-hidden relative image-zoom-container bg-[var(--color-primary-bg)]'>
                    {featuredimage ? (
                        <img src={appwriteService.getFilePreview(featuredimage)} alt={title} className='w-full h-full object-cover' />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-secondary-text)] text-sm">No Image</div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[var(--color-primary-text)] text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full shadow-sm">
                            {category || 'Editorial'}
                        </span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <h2 className='text-xl md:text-2xl font-bold font-heading mb-3 line-clamp-3 leading-tight group-hover:text-[var(--color-accent-primary)] transition-colors'>{title}</h2>
                    <div className="mt-auto pt-4 flex items-center justify-between text-[13px] text-[var(--color-secondary-text)] font-medium">
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden border border-[var(--color-border-light)]">
                                <UserAvatar userId={userId} name={authorName} />
                            </div>
                            <span>{authorName || 'By Author'}</span>
                        </div>
                        <span>{displayReadTime} &middot; {displayDate}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Postcard
