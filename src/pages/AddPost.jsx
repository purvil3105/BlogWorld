import React from 'react';
import { Container, PostForm } from '../components';

function AddPost() {
  return (
    <div className='py-8'>
      <Container>
        <h1 className='text-3xl font-bold mb-6'>Create a New Post</h1>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;