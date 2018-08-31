const express = require('express');

const actions = require('./data/helpers/actionModel');
const projects = require('./data/helpers/projectModel');

const server = express();
server.use(express.json());

//middleware
function checkIfProjectExists (req, res, next) {
    const {id} = req.params;
    projects.get(id)
    .then(project => {
        if (project) {
            next();
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The project with the specified ID does not exist." });
    });
}

function checkProjectId (req, res, next) {
    const id = req.body.project_id;
    projects.get(id)
    .then(project => {
        if (project) {
            next();
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Please enter a valid project ID." });
    });
}

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

server.get('/projects/:id/project-actions', checkIfProjectExists, (req, res) => {
    const {id} = req.params;
    projects.getProjectActions(id)
    .then(actions => {
        if (actions.length > 0) {
            res.status(200).json(actions);
        } else if (actions.length === 0) {
            res.status(400).json({ message: "There are no actions for this project." })
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The project actions could not be retrieved." });
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
            res.status(200).json({ message: "The project was successfully deleted." });
          } else {
            res.status(404).json({ message: "The project with the specified ID does not exist." })
          }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The project could not be removed" })
        });
  })


// -------ACTIONS---------
server.get('/actions', (req, res) => {
    actions.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The actions information could not be retrieved." });
    })
})

server.get('/actions/:id', (req, res) => {
    const {id} = req.params;
    actions.get(id)
    .then(action => {
        if (action) {
            res.status(200).json(action);
        } 
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The action with the specified ID does not exist." });
    });
})

server.post('/actions', checkProjectId, (req, res) => {
    const {body} = req;
    if (!body.description || !body.notes) {
        res.status(400).json({ error: "Please provide a description and notes for this action." });
    }  else if (Number(body.description.length) > 128) {
        res.status(400).json({ error: "Please provide a description that is less than 128 characters long." });
    } else 
        actions.insert(body)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "There was an error while saving the action to the database" });
        });
})

server.put('/actions/:id', checkProjectId, (req, res) => {
    const {id} = req.params;
    const {body} = req;
    if (!body.description || !body.notes) {
        res.status(400).json({ error: "Please provide a description and notes for this action." });
    }  else if (Number(body.description.length) > 128) {
        res.status(400).json({ error: "Please provide a description that is less than 128 characters long." });
    } else 
        actions.update(id, body)
        .then(action => {
          if (action === null) {
            res.status(404).json({ message: "The action with the specified ID does not exist." });
          }  else {
            res.status(200).json({ message: "The action was updated successfully." });
          }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "The action information could not be modified." })
        });
  })

server.delete('/actions/:id', (req, res) => {
    const {id} = req.params;
    actions.remove(id)
      .then(count => {
          if (count) {
            res.status(200).json({ message: "The action was successfully deleted." });
          } else {
            res.status(404).json({ message: "The action with the specified ID does not exist." })
          }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The action could not be removed" })
        });
  })


server.listen(8000, () => console.log('API running on port 8000'));