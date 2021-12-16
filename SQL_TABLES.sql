DROP TABLE IF EXISTS leaderboard;

CREATE TABLE leaderboard (
  dogID SERIAL PRIMARY KEY,
  breed text,
  votes INT DEFAULT 0,
  UNIQUE (breed)
)
INSERT INTO leaderboard (breed) VALUES ('Golden retriever');

INSERT INTO leaderboard (breed)
VALUES('Patterdale Terrier')
ON CONFLICT (breed)
DO NOTHING