const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/", async (req, res) => {
  const temp = Object.values(req.body).map(item => item)
  const newConversation = new Conversation({
    // members: [req.body.senderId, req.body.receiverId],
    members: temp,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/chat/:chatId", async (req, res) => {
  try {
    const chat = await Conversation.findById(req.params.chatId);
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;