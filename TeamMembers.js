import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', email: '', avatar: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/team-members');
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching:', err);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/team-members/${editId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/team-members', form);
      }
      setShow(false);
      setForm({ name: '', role: '', email: '', avatar: '' });
      setEditId(null);
      fetchMembers();
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error saving. Check required fields.');
    }
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditId(member._id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await axios.delete(`http://localhost:5000/api/team-members/${id}`);
    fetchMembers();
  };

  return (
    <div className='d-flex'
     style={{ background: '#e3f2fd', minHeight: '100vh', padding: '1rem' }}>
       <AdminSidebar/>
      <Container>
        <ul className='nav flex-row mt-4'></ul>
        <h2 className="text-center fw-bold nav flex-column mb-4">Team Members</h2>
        <div className="text-center">
          <Button variant="primary" onClick={() => setShow(true)}>Add Member</Button>
        </div>
        <Row className="mt-4">
          {members.map((m) => (
            <Col md={4} key={m._id} className="mb-4">
              <Card className="shadow-lg border-0" style={{backgroundColor: "ffffffee", borderRadius: "20px"}}>
                <Card.Img variant="top" src={m.avatar || 'https://via.placeholder.com/150'} />
                <Card.Body>
                  <Card.Title>{m.name}</Card.Title>
                  <Card.Text><strong>Role:</strong> {m.role}<br /><strong>Email:</strong> {m.email}</Card.Text>
                  <Button variant="info" className="me-2" onClick={() => handleEdit(m)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(m._id)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Member' : 'Add Member'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {['name', 'role', 'email', 'avatar'].map((field) => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default TeamMembers;