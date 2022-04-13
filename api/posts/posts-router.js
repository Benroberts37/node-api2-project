// implement your posts router here
const express = require("express");
const Poster = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  Poster.find(req.query)
    .then((posters) => {
      res.status(200).json(posters);
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          message: "The posts information could not be retrieved",
          err: err.message,
        });
    });
});

router.get("/:id", (req, res) => {
  Poster.findById(req.params.id)
    .then((poster) => {
      if (poster) {
        res.status(200).json(poster);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          message: "The post information could not be retrieved",
          err: err.message,
        });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Poster.insert({ title, contents })
      .then(({ id }) => {
        return Poster.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        res
          .status(500)
          .json({
            message: "There was an error while saving the post to the database",
            err: err.message,
          });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  
  if (!title || !contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" });
  } else {
    Poster.findById(id)
      .then((stuff) => {
        if (!stuff) {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
          return Poster.update(id, req.body)
        }
      })
      .then(data => {
        if (data) {
          return Poster.findById(id)
        }
      })
      .then(post => {
        res.json(post)
      })
      .catch((err) => {
        res.status(500).json({message: "The post information could not be modified", err: err.message,
          });
      });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
 try {
  const post = await Poster.findById(id)
  if (!post) {
    res.status(404).json({message: "The post with the specified ID does not exist"})
  } else {
    await Poster.remove(id)
    res.json(post)
  }
 } catch (err) {
  res.status(500).json({message: "The post could not be removed", err: err.message,
    });
 }
});

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
   const post = await Poster.findById(id)
   if (!post) {
     res.status(404).json({message: "The post with the specified ID does not exist"})
   } else {
     const messages = await Poster.findPostComments(id)
     res.json(messages)
    //  res.json(post)
   }
  } catch (err) {
   res.status(500).json({message: "The comments information could not be retrieved", err: err.message,
     });
  }
})

module.exports = router;