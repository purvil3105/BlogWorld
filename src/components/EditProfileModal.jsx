import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import authService from '../appwrite/auth';

function EditProfileModal({ isOpen, onClose, userPrefs, userName, onSaveSuccess }) {
    const [name, setName] = useState(userName || '');
    const [bio, setBio] = useState(userPrefs?.bio || '');
    const [age, setAge] = useState(userPrefs?.age || '');
    const [country, setCountry] = useState(userPrefs?.country || '');
    const [gender, setGender] = useState(userPrefs?.gender || '');
    const [interests, setInterests] = useState(userPrefs?.interests ? userPrefs.interests.join(', ') : '');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update name if changed
            if (name && name !== userName) {
                await authService.updateName(name);
            }
            
            // Format interests string into array
            const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i !== '');

            const newPrefs = {
                bio,
                age: age ? parseInt(age) : null,
                country,
                gender,
                interests: interestsArray
            };
            
            await authService.updateUserPrefs(newPrefs);
            onSaveSuccess();
            onClose();
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[var(--color-primary-bg)] rounded-[24px] shadow-[var(--shadow-editorial)] border border-[var(--color-border-light)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-light)] bg-white/50">
                    <h2 className="text-xl font-bold font-heading text-[var(--color-primary-text)]">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-[var(--color-secondary-text)]">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-5 bg-white">
                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-primary-text)] mb-2">Display Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[var(--color-primary-bg)] border border-[var(--color-border-light)] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-gray-400"
                            placeholder="Your name"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-primary-text)] mb-2">Bio</label>
                        <textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-[var(--color-primary-bg)] border border-[var(--color-border-light)] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-gray-400 resize-none h-24"
                            placeholder="Tell us a little about yourself"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--color-primary-text)] mb-2">Age</label>
                            <input 
                                type="number" 
                                value={age} 
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full bg-[var(--color-primary-bg)] border border-[var(--color-border-light)] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-gray-400"
                                placeholder="e.g. 28"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--color-primary-text)] mb-2">Gender</label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full bg-[var(--color-primary-bg)] border border-[var(--color-border-light)] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors text-[var(--color-secondary-text)]"
                            >
                                <option value="" disabled>Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-primary-text)] mb-2">Country</label>
                        <input 
                            type="text" 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-[var(--color-primary-bg)] border border-[var(--color-border-light)] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-gray-400"
                            placeholder="e.g. United States"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-primary-text)] mb-2">Interests</label>
                        <input 
                            type="text" 
                            value={interests} 
                            onChange={(e) => setInterests(e.target.value)}
                            className="w-full bg-[var(--color-primary-bg)] border border-[var(--color-border-light)] rounded-[14px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-gray-400"
                            placeholder="Technology, Design, Travel (comma separated)"
                        />
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border-light)] flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-sm font-medium border border-[var(--color-border-light)] text-[var(--color-secondary-text)] hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                            <Save className="w-4 h-4" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
