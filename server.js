import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// const PORT = 5000;
const PORT = process.env.PORT || 5000;

const messages = [];
const visitors = [];


app.get("/session", (req, res) => {
  const { websiteId, sessionId } = req.query;

  console.log("Website ID:", websiteId);

  res.json({
    success: true,
    websiteId,
    sessionId: sessionId || `sess_${Date.now()}`,
    visitorId: `visitor_${Math.floor(Math.random() * 100000)}`,
    config: {
      title: "Infomanav Support",
      primaryColor: "#2563eb",
    },
  });
});


app.post("/visitor", (req, res) => {
  const { sessionId, email } = req.body;

  const existingVisitor = visitors.find(
    (visitor) => visitor.sessionId === sessionId
  );

  if (existingVisitor) {
    existingVisitor.email = email;
  } else {
    visitors.push({
      sessionId,
      email,
    });
  }

  res.json({
    success: true,
  });
});


/*
  GET /session
*/
app.get("/sessions", (req, res) => {
  const sessions = visitors.map((visitor) => ({
    sessionId: visitor.sessionId,
    email: visitor.email,
  }));

  res.json({
    success: true,
    sessions,
  });
});

app.post("/message", (req, res) => {
  const { sessionId, message } = req.body;

  const newMessage = {
    id: Date.now(),
    sessionId,
    message,
    sender: "visitor",
    createdAt: new Date(),
  };

  messages.push(newMessage);

  console.log(messages);

  res.json({
    success: true,
    message: newMessage,
  });
});


app.get("/messages", (req, res) => {
  const { sessionId } = req.query;

  const sessionMessages = messages.filter(
    (message) => message.sessionId === sessionId
  );

  res.json({
    success: true,
    messages: sessionMessages,
  });
});



app.post("/reply", (req, res) => {
  const { sessionId, message } = req.body;

  const newMessage = {
    id: Date.now(),
    sessionId,
    message,
    sender: "agent",
    createdAt: new Date(),
  };

  messages.push(newMessage);

  res.json({
    success: true,
    message: newMessage,
  });
});








app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});