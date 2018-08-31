const express = require('express');

const router = express.Router();

const projects = require('../projects/projectModel');


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

//routes
router.get('/', (req, res) => {
    projects.get()
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The project information could not be retrieved." });
    })
})

router.get('/:id', (req, res) => {
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

router.get('/:id/project-actions', checkIfProjectExists, (req, res) => {
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

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

  router.delete('/:id', (req, res) => {
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

  module.exports = router;