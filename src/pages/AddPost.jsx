import React from 'react';
import { Container, PostForm } from '../components';

function AddPost() {
  return (
    <div className='w-full min-h-screen'>
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;