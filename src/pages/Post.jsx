import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import authservice from "../appwrite/auth";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.userData.$id : false;
    console.log("Post data:", post);
    // console.log("User data:", userData.userData.$id);
    // console.log("Is author:", isAuthor);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    setLoading(false);
                } else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    if (loading) return <div>Loading...</div>;
    console.log("Featured image ID:", post.featuredimage);
    const deletePost = () => {
        appwriteService.Deletepost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredimage);
                navigate(-1);
            }
        });
    };
    console.log(isAuthor);

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-lg p-4 shadow-md">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-lg"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                </div>
                <div className="content">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}