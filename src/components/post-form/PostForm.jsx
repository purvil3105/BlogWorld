import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, RTE } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Save, ImagePlus, X } from 'lucide-react'

function PostForm({ post }) {
    const { register, handleSubmit, watch, control, setValue, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
            category: post?.category || 'Technology',
        },
    })

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData)
    const [authorAvatarId, setAuthorAvatarId] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    
    React.useEffect(() => {
        const uid = userData?.$id || userData?.userData?.$id;
        if (uid) {
            appwriteService.getProfile(uid).then(profile => {
                if (profile && profile.avatarId) {
                    setAuthorAvatarId(profile.avatarId)
                }
            }).catch(() => {})
        }
    }, [userData])

    const [previewUrl, setPreviewUrl] = React.useState(post ? appwriteService.getFilePreview(post.featuredimage) : null);

    const submit = async (data) => {
        setIsSubmitting(true);
        try {
            if (post) {
                const file = data.image && data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
                if (file) {
                    appwriteService.deleteFile(post.featuredimage)
                }
                const dbPost = await appwriteService.Updatepost(post.$id, {
                    ...data,
                    featuredimage: file ? file.$id : undefined
                })
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            } else {
                if (!data.image || !data.image[0]) {
                    alert("Please add a cover image before publishing.");
                    setIsSubmitting(false);
                    return;
                }
                if (!data.content || data.content === '<p><br></p>') {
                    alert("Please write some content before publishing.");
                    setIsSubmitting(false);
                    return;
                }
                const file = await appwriteService.uploadFile(data.image[0])
                if (file) {
                    const fileId = file.$id
                    data.featuredimage = fileId
                    const uid = userData?.$id || userData?.userData?.$id;
                    const uname = userData?.name || userData?.userData?.name || 'Author';
                    try {
                        const dbPost = await appwriteService.createPost({
                            ...data,
                            userId: uid,
                            authorName: uname,
                            authorAvatarId: authorAvatarId,
                        })
                        if (dbPost) {
                            if (data.status === 'active') {
                                appwriteService.logActivity(uid, 'publish', dbPost.$id, `Published a new story: ${dbPost.title}`);
                            }
                            navigate(`/post/${dbPost.$id}`)
                        }
                    } catch (error) {
                        await appwriteService.deleteFile(fileId)
                        alert(`Failed to publish the post. Appwrite says: "${error.message}". Image was safely removed.`)
                    }
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .substring(0, 36)
                .replace(/^-+|-+$/g, '');
        }
        return ''
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title' && !post) {
                setValue('slug', slugTransform(value.title), { shouldValidate: true })
            }
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue, post])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onError = (errors) => {
        console.error("Form validation failed. Missing fields:", errors);
        if (errors.title) alert("Please enter an article title.");
        else if (errors.slug) alert("Please ensure the custom URL slug is valid.");
        else alert("Please fill all required fields before publishing.");
    };

    return (
        <form onSubmit={handleSubmit(submit, onError)} className="relative max-w-4xl mx-auto w-full pt-12 pb-32 px-4 md:px-8 bg-[var(--color-primary-bg)]">
            {/* Top Action Bar (Floating Save) */}
            <div className="fixed top-24 right-4 md:right-10 z-40 flex items-center space-x-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full border border-[var(--color-border-light)] shadow-[var(--shadow-editorial)]">
                <select 
                    {...register("category")} 
                    className="appearance-none bg-transparent pl-4 pr-4 py-2 text-sm font-medium focus:outline-none cursor-pointer border-r border-[var(--color-border-light)] text-[var(--color-secondary-text)] hover:text-black transition-colors"
                >
                    <option value="" disabled>Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Development">Development</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Food">Food</option>
                    <option value="Space">Space</option>
                    <option value="Science">Science</option>
                    <option value="Politics">Politics</option>
                    <option value="History">History</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Government">Government</option>
                    <option value="Nations">Nations</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Places">Places</option>
                    <option value="Location">Location</option>
                </select>
                <select 
                    {...register("status", { required: true })} 
                    className="appearance-none bg-transparent pl-4 pr-8 py-2 text-sm font-medium focus:outline-none cursor-pointer border-r border-[var(--color-border-light)]"
                >
                    <option value="active">Published</option>
                    <option value="inactive">Draft</option>
                </select>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                        isSubmitting 
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-[var(--color-primary-text)] text-white hover:bg-black"
                    }`}
                >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? "Publishing..." : post ? "Update" : "Publish"}</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="space-y-8">
                {/* Cover Image */}
                <div className="w-full relative group">
                    {previewUrl ? (
                        <div className="relative w-full aspect-[21/9] rounded-[24px] overflow-hidden border border-[var(--color-border-light)]">
                            <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 flex items-center space-x-2">
                                    <ImagePlus className="w-4 h-4" />
                                    <span>Change Cover</span>
                                    <input type="file" className="hidden" accept="image/png, image/jpg, image/jpeg, image/gif" {...register("image")} onChange={(e) => {
                                        register("image").onChange(e);
                                        handleImageChange(e);
                                    }} />
                                </label>
                                <button type="button" onClick={() => setPreviewUrl(null)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="cursor-pointer w-full aspect-[21/9] rounded-[24px] border-2 border-dashed border-[var(--color-border-light)] hover:border-[var(--color-primary-text)] bg-white/50 flex flex-col items-center justify-center transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-secondary-bg)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary-text)] group-hover:text-white transition-colors">
                                <ImagePlus className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-[var(--color-secondary-text)]">Add Cover Image</span>
                            <input type="file" className="hidden" accept="image/png, image/jpg, image/jpeg, image/gif" {...register("image")} onChange={(e) => {
                                register("image").onChange(e);
                                handleImageChange(e);
                            }} />
                        </label>
                    )}
                </div>

                <div className="pt-6">
                    <input
                        type="text"
                        placeholder="Article Title"
                        className="w-full text-4xl md:text-6xl font-bold font-heading bg-transparent border-none outline-none placeholder:text-gray-300 focus:ring-0 resize-none text-[var(--color-primary-text)] tracking-tight leading-tight"
                        {...register("title", { required: true })}
                    />
                    
                    <div className="flex items-center space-x-2 mt-4 opacity-50 focus-within:opacity-100 transition-opacity">
                        <span className="text-sm text-[var(--color-secondary-text)] bg-gray-100 px-2 py-1 rounded">/post/</span>
                        <input
                            type="text"
                            placeholder="custom-url-slug"
                            className={`flex-1 text-sm font-body bg-transparent border-none outline-none focus:ring-0 ${post ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--color-secondary-text)] placeholder:text-gray-300'}`}
                            {...register("slug", { required: true })}
                            readOnly={!!post}
                            onInput={(e) => {
                                if (!post) {
                                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="w-full pt-8">
                    <RTE
                        name="content"
                        control={control}
                        defaultValue={getValues("content")}
                    />
                </div>
            </div>
        </form>
    );
}

export default PostForm