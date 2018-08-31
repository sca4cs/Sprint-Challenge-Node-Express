const express = require('express');

const actionRoutes = require('./data/actions/actionRoutes');
const projectRoutes = require('./data/projects/projectRoutes');

const server = express();

server.use(express.json());
server.use('/actions', actionRoutes);
server.use('/projects', projectRoutes);

server.listen(8000, () => console.log('API running on port 8000'));