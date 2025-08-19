import {
  Box,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../lib/api';

interface Project {
  id: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: string;
}

function ProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [repoPath, setRepoPath] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/projects', { fullName: repoPath });
      setRepoPath('');
      fetchProjects();
    } catch (err) {
      setError('Failed to add project.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to delete project.');
    }
  };

  const handleUpdate = () => {
    fetchProjects();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      <Box
        component="form"
        onSubmit={handleAddProject}
        sx={{ mb: 4, display: 'flex', gap: 2 }}
      >
        <TextField
          label="Repository Path (owner/repo)"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Add Project
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Stars</TableCell>
            <TableCell>Forks</TableCell>
            <TableCell>Issues</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Link href={project.url} target="_blank" rel="noopener">
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>{project.url}</TableCell>
              <TableCell>{project.stars}</TableCell>
              <TableCell>{project.forks}</TableCell>
              <TableCell>{project.issues}</TableCell>
              <TableCell>
                {new Date(project.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={handleUpdate}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsPageContent />
    </ProtectedRoute>
  );
}
