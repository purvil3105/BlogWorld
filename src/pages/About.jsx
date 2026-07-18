import React, { useState, useEffect } from 'react'
import { Container } from '../components'
import { PenTool, Users, FileText, Globe } from 'lucide-react';
import appwriteService from '../appwrite/config'

function About() {
    const [stats, setStats] = useState({ authors: 0, posts: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [postsData, profilesData] = await Promise.all([
                    appwriteService.getPosts(), 
                    appwriteService.getProfiles()
                ]);
                
                setStats({
                    posts: postsData ? postsData.total : 0,
                    authors: profilesData ? profilesData.total : 0
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className='w-full min-h-screen py-24 bg-[var(--color-primary-bg)]'>
            <Container>
                <div className="flex flex-col items-center justify-center mb-16 text-center max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-white rounded-full shadow-[var(--shadow-editorial)] flex items-center justify-center mb-6 border border-[var(--color-border-light)]">
                        <PenTool className="w-8 h-8 text-[var(--color-primary-text)]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-8 text-[var(--color-primary-text)] leading-tight">
                        We believe in the power of thoughtful storytelling.
                    </h1>
                    
                    <div className="prose prose-lg text-[var(--color-secondary-text)] font-body font-light text-left md:text-center leading-relaxed">
                        <p>
                            BlogWorld was created with a simple mission: to provide a quiet, beautiful, and distraction-free space for writers to share their best ideas and for readers to explore them. 
                        </p>
                        <p>
                            In a world full of noise, we prioritize typography, whitespace, and a premium reading experience that respects your time and attention. Whether you are exploring technology, design, or lifestyle, you will find stories that matter here.
                        </p>
                        <p>
                            Join us in crafting the next generation of editorial content.
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-[var(--color-border-light)] pt-12 w-full">
                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                            <Users className="w-6 h-6 text-[var(--color-secondary-text)] mb-3" />
                            <span className="text-4xl font-bold font-heading text-[var(--color-primary-text)] mb-1">{stats.authors || '...'}</span>
                            <span className="text-[var(--color-secondary-text)] font-medium text-sm uppercase tracking-wider">Creators</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow">
                            <FileText className="w-6 h-6 text-[var(--color-secondary-text)] mb-3" />
                            <span className="text-4xl font-bold font-heading text-[var(--color-primary-text)] mb-1">{stats.posts || '...'}</span>
                            <span className="text-[var(--color-secondary-text)] font-medium text-sm uppercase tracking-wider">Stories</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-[var(--color-border-light)] shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                            <Globe className="w-6 h-6 text-[var(--color-secondary-text)] mb-3" />
                            <span className="text-4xl font-bold font-heading text-[var(--color-primary-text)] mb-1">1</span>
                            <span className="text-[var(--color-secondary-text)] font-medium text-sm uppercase tracking-wider">Community</span>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default About
