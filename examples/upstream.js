// Demo upstream: the thing worth paying for.
// Run on :8080, then put farebox in front of it.
import express from "express";

const app = express();

app.get("/api/fortune", (_req, res) => {
  const fortunes = [
    "The agent that pays for its inputs never gets rate limited.",
    "A fare of $0.005 beats a $29/mo subscription you forgot to cancel.",
    "HTTP 402: reserved in 1997, employed in 2026.",
    "Your API was always worth something. Now it has a price.",
  ];
  res.json({
    fortune: fortunes[Math.floor(Math.random() * fortunes.length)],
    served_at: new Date().toISOString(),
  });
});

app.listen(8080, () => console.log("upstream demo on :8080"));
