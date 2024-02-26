CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  username varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id),
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(255),
  body text,
  voice_note boolean,
  public boolean
);

CREATE TABLE IF NOT EXISTS files (
  id bigserial PRIMARY KEY,
  note_id bigint NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  name varchar(255),
  type varchar(255),
  data bytea
);
