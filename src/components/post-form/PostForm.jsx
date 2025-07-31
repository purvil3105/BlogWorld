import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
    const { register, handleSubmit, watch, control, setValue, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active', // Fixed: provide default value
        },
    })

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData)
    console.log(userData);

    const submit = async (data) => {
        try {
            if (post) {
                console.log(post + "sdg");

                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
                console.log(file);

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
                const file = await appwriteService.uploadFile(data.image[0])
                // console.log(file);

                if (file) {
                    const fileId = file.$id
                    data.featuredimage = fileId
                    console.log(userData.$id);
                    // console.log(data);


                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.userData.$id
                    })
                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`)
                    }
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    // Fixed: SlugTransform function - corrected regex
    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
        }
        return ''
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title), { shouldValidate: true })
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="flex flex-wrap bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl p-6 gap-4 border border-gray-200"
        >
            {/* Left Section: Title, Slug, Content */}
            <div className="w-full md:w-2/3 px-2 space-y-4">
                <Input
                    label="Title"
                    placeholder="Enter post title"
                    className="w-full"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug"
                    placeholder="Slug (auto-generated)"
                    className="w-full"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <div className="w-full">
                    <RTE
                        label="Content"
                        name="content"
                        control={control}
                        defaultValue={getValues("content")}
                    />
                </div>
            </div>

            {/* Right Section: Image, Status, Submit Button */}
            <div className="w-full md:w-1/3 px-2 space-y-4">
                <Input
                    label="Featured Image"
                    type="file"
                    className="w-full"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-xl shadow-md w-full object-cover max-h-48"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="w-full"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    bgcolor={post ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                    className="w-full text-lg font-semibold border-2 rounded-2xl border-black cursor-pointer bg-green-600 hover:bg-green-400"
                >
                    {post ? "Update Post" : "Create Post"}
                </Button>
            </div>
        </form>


    );
}

export default PostForm