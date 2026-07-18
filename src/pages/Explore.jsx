import React, { useState, useEffect } from 'react';
import { Container } from '../components';
import appwriteService from "../appwrite/config";
import { Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Explore() {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                // Fetch up to 20 profiles
                const response = await appwriteService.getProfiles();
                if (response) {
                    // Shuffle for discovery feel
                    const shuffled = [...response.documents].sort(() => 0.5 - Math.random());
                    setCreators(shuffled);
                }
            } catch (error) {
                console.error("Error fetching creators:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCreators();
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-secondary-text)] font-medium tracking-widest uppercase text-xs">Loading</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen py-24 bg-[var(--color-primary-bg)]'>
            <Container>
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-[var(--shadow-editorial)] flex items-center justify-center mb-6 border border-[var(--color-border-light)]">
                        <Users className="w-8 h-8 text-[var(--color-primary-text)]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-[var(--color-primary-text)]">Discover Creators</h1>
                    <p className="text-[var(--color-secondary-text)] max-w-xl mx-auto">Find brilliant minds and fresh perspectives. Follow your favorite authors to curate your personalized feed.</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {creators.length > 0 ? (
                        creators.map((creator) => (
                            <Link to={`/user/${creator.userId}`} key={creator.$id} className="bg-white border border-[var(--color-border-light)] rounded-[24px] p-6 flex flex-col items-center text-center hover:shadow-[var(--shadow-editorial)] transition-all group">
                                <div className="w-24 h-24 rounded-full mb-5 bg-gray-100 overflow-hidden border border-[var(--color-border-light)]">
                                    <img src={creator.avatarId ? appwriteService.getFilePreview(creator.avatarId) : `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name || 'Author')}&background=random`} alt={creator.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <h3 className="font-bold font-heading text-xl text-[var(--color-primary-text)] mb-1 group-hover:text-[var(--color-accent-primary)] transition-colors">{creator.name || 'Anonymous Author'}</h3>
                                
                                {creator.country && (
                                    <div className="flex items-center text-xs font-semibold text-[var(--color-secondary-text)] mb-3">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {creator.country}
                                    </div>
                                )}
                                
                                <p className="text-sm text-[var(--color-secondary-text)] line-clamp-3 mb-6">
                                    {creator.bio || 'This creator hasn\'t written a bio yet.'}
                                </p>
                                
                                <div className="mt-auto w-full">
                                    <button className="w-full py-2.5 rounded-full border border-[var(--color-border-light)] text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-colors">
                                        View Profile
                                    </button>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-[var(--color-secondary-text)]">No creators found. Be the first to set up your public profile!</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Explore;
