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
            status: post?.status || 'active',
        },
    })

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData)
    console.log("User data in PostForm:", userData);
    const submit = async (data) => {
        try {
            if (post) {
                
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
                console.log("Uploaded file:", file);
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
                console.log("Uploaded file:", file);
                if (file) {
                    const fileId = file.$id
                    data.featuredimage = fileId

                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.userData.$id,
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

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '')
                .replace(/\s+/g, '-')
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
            className="flex flex-wrap bg-white rounded-xl shadow-lg p-8 gap-6 border-2 border-blue-200"
        >
            <div className="w-full md:w-2/3 px-2 space-y-6">
                <Input
                    label="Title"
                    placeholder="Enter post title"
                    className="w-full border border-gray-300 rounded-lg focus:border-blue-400"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug"
                    placeholder="Slug (auto-generated)"
                    className="w-full border border-gray-300 rounded-lg focus:border-blue-400"
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

            <div className="w-full md:w-1/3 px-2 space-y-6">
                <Input
                    label="Featured Image"
                    type="file"
                    className="w-full border border-gray-300 rounded-lg focus:border-blue-400"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg shadow-md w-full object-cover max-h-48 border border-gray-300"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="w-full border border-gray-300 rounded-lg focus:border-blue-400"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    className={`w-full text-lg font-semibold border-2 rounded-lg border-blue-500 cursor-pointer transition-colors duration-200
                        ${post
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {post ? "Update Post" : "Create Post"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm