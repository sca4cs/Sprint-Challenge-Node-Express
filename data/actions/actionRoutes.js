const express = require('express');

const router = express.Router();

const actions = require('../actions/actionModel');
const projects = require('../projects/projectModel');

//middleware
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

//routes
router.get('/', (req, res) => {
    actions.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: "The actions information could not be retrieved." });
    })
})

router.get('/:id', (req, res) => {
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

router.post('/', checkProjectId, (req, res) => {
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

router.put('/:id', checkProjectId, (req, res) => {
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

  router.delete('/:id', (req, res) => {
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

  module.exports = router;