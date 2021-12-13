CREATE TABLE leaderboard (
  dogID SERIAL PRIMARY KEY,
  breed text,
  votes INT DEFAULT 0
)

DROP TABLE leaderboard;

INSERT INTO leaderboard (breed) VALUES ('Golden retriever');