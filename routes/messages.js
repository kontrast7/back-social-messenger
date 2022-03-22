const router = require("express").Router();
const Message = require("../models/Message");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId || req.body.isAdmin) {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.status(200).json("Message deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete message only your account!");
  }
});

// router.get("/find/:id", async (req, res) => {
//   try {
//     const all = await Message.find({ _id: { $ne: req.params.id } })
//     res.status(200).json(all);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
