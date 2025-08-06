import React, { useEffect, useState } from 'react';
import { Container, PostForm } from '../components';
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { postId } = useParams(); // Changed from slug to postId
    const navigate = useNavigate();

    useEffect(() => {
        if (!postId) {
            navigate('/');
            return;
        }

        appwriteService.getPost(postId).then((postData) => {
            if (postData) {
                setPost(postData);
            } else {
                navigate('/');
            }
            setLoading(false);
        }).catch(() => {
            navigate('/');
        });
    }, [postId, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!post) return null;

    return (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    );
}

export default EditPost;