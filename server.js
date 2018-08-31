const express = require('express');

const actions = require('./data/helpers/actionModel');
const projects = require('./data/helpers/projectModel');

const server = express();
server.use(express.json());


// -------PROJECTS---------
server.get('/projects', (req, res) => {
    projects.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The project information could not be retrieved." });
    })
})

server.get('/projects/:id', (req, res) => {
    const {id} = req.params;
    projects.get(id)
    .then(project => {
        if (project) {
            res.status(200).json(project);
        } 
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The project with the specified ID does not exist." });
    });
})

server.post('/projects', (req, res) => {
    const {body} = req;
    if (!body.name || !body.description) {
        res.status(400).json({ error: "Please provide a name and description for this project." });
    }  else if (Number(body.name.length) > 128) {
        res.status(400).json({ error: "Please provide a name that is less than 128 characters long." });
    } else 
        projects.insert(body)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "There was an error while saving the project to the database" });
        });
})

server.put('/projects/:id', (req, res) => {
    const {id} = req.params;
    const {body} = req;
    if (!body.name || !body.description) {
        res.status(400).json({ error: "Please provide a name and description for this project." });
    }  else if (Number(body.name.length) > 128) {
        res.status(400).json({ error: "Please provide a name that is less than 128 characters long." });
    } else 
        projects.update(id, body)
        .then(project => {
          if (project === null) {
            res.status(404).json({ message: "The project with the specified ID does not exist." });
          }  else {
            res.status(200).json({ message: "The project was updated successfully." });
          }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "The project information could not be modified." })
        });
  })

server.delete('/projects/:id', (req, res) => {
    const {id} = req.params;
    projects.remove(id)
      .then(count => {
          if (count) {
            res.status(200).json({ message: "The user was successfully deleted." });
          } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
          }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The user could not be removed" })
        });
  })



server.listen(8000, () => console.log('API running on port 8000'));