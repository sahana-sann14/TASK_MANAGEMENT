import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar'; // ✅ Make sure this path is correct

const COLORS = ['#28a745', '#ffc107', '#dc3545', '#6c757d']; // Completed, In Progress, Overdue, Pending

const TaskProgress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token'); // ✅ Get JWT
      const res = await axios.get('http://localhost:5000/api/tasks/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const data = res.data;
      const overdueCount = data.overdue || 0;
      const totalTasks = data.total || 1;
      const overduePercent = (overdueCount / totalTasks) * 100;

      if (overduePercent > 50) {
        setAlertMessage('🚨 More than 50% of tasks are overdue!');
      }

      setProgress(data);
      setLoading(false);
    } catch (err) {
      console.error('Progress fetch failed:', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  const pieData = [
    { name: 'Completed', value: progress.completed || 0 },
    { name: 'In Progress', value: progress.inProgress || 0 },
    { name: 'Overdue', value: progress.overdue || 0 },
    { name: 'Pending', value: progress.pending || 0 },
  ];

  const barData = [
    { status: 'Completed', count: progress.completed || 0 },
    { status: 'In Progress', count: progress.inProgress || 0 },
    { status: 'Overdue', count: progress.overdue || 0 },
    { status: 'Pending', count: progress.pending || 0 },
  ];

  const completionRate = ((progress.completed / progress.total) * 100).toFixed(1);

  return (
    <div className="d-flex ">
      <AdminSidebar /> {/* ✅ Admin Sidebar included */}

      <Container fluid className="mt-4">
        <h3 className="text-center mb-4 text-primary">📊 Task Progress Overview</h3>

        {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}

        <Row className="mb-4">
          <Col md={3}>
            <Card bg="info" text="white" className="text-center shadow">
              <Card.Body>
                <Card.Title>Total Tasks</Card.Title>
                <Card.Text className="display-6 fw-bold">{progress.total}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="text-center shadow">
              <Card.Body>
                <Card.Title>Completed</Card.Title>
                <Card.Text className="display-6 fw-bold">{progress.completed}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="text-center shadow">
              <Card.Body>
                <Card.Title>In Progress</Card.Title>
                <Card.Text className="display-6 fw-bold">{progress.inProgress}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="danger" text="white" className="text-center shadow">
              <Card.Body>
                <Card.Title>Overdue</Card.Title>
                <Card.Text className="display-6 fw-bold">{progress.overdue}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow p-3">
              <Card.Title>Completion Rate</Card.Title>
              <div className="progress" style={{ height: '30px' }}>
                <div
                  className="progress-bar progress-bar-striped bg-success"
                  role="progressbar"
                  style={{ width: `${completionRate}%` }}
                >
                  {completionRate}%
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="p-3 shadow">
              <h5 className="text-center">Pie Chart</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3 shadow">
              <h5 className="text-center">Bar Chart</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TaskProgress;
