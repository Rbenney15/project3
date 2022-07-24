import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card style={{ width: '100%' }}>
      <Card.Body>
        <Card.Title>Sign Up</Card.Title>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={handleChange} defaultValue={formState.username} type='text' placeholder='Username'></Form.Control>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control onChange={handleChange} defaultValue={formState.email} type='email' placeholder='Email'></Form.Control>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={handleChange} defaultValue={formState.password} type='password' placeholder='Password'></Form.Control>
          </Form.Group>
          <Button variant='primary' type="submit">Sign Up</Button>
        </Form>

        <Card.Text>
          Already signed up? Login here
        </Card.Text>

        {error && <div>Signup failed</div>}

      </Card.Body>
    </Card>
  );
};

export default Signup;