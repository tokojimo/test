BEGIN;

-- ===================================================================
-- Extensions
-- ===================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Password hashing examples:
--   -- Bcrypt with cost 12
--   SELECT crypt('secret', gen_salt('bf', 12));
--   -- Argon2id
--   SELECT crypt('secret', gen_salt('argon2id'));

-- ===================================================================
-- Enumerated types
-- ===================================================================
CREATE TYPE subscription_status AS ENUM ('free','premium');
ALTER TYPE subscription_status OWNER TO app;
CREATE TYPE alert_type AS ENUM ('optimum','new_area');
ALTER TYPE alert_type OWNER TO app;
CREATE TYPE download_status AS ENUM ('pending','downloading','paused','completed','error');
ALTER TYPE download_status OWNER TO app;

-- ===================================================================
-- Core tables
-- ===================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  language TEXT NOT NULL DEFAULT 'fr',
  units TEXT NOT NULL DEFAULT 'metric' CHECK (units IN ('metric','imperial')),
  gps_enabled BOOLEAN NOT NULL DEFAULT true,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  subscription subscription_status NOT NULL DEFAULT 'free',
  subscription_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE users OWNER TO app;
COMMENT ON TABLE users IS 'Registered application users';
COMMENT ON COLUMN users.password_hash IS 'Hashed password. Use pgcrypto''s crypt() with bcrypt or argon2id.';

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  dnd_start TIME,
  dnd_end TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE user_settings OWNER TO app;
COMMENT ON TABLE user_settings IS 'Per-user preferences';

CREATE TABLE user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  radius_km INT CHECK (radius_km IS NULL OR radius_km BETWEEN 1 AND 500),
  frequency_minutes INT CHECK (frequency_minutes IS NULL OR frequency_minutes BETWEEN 5 AND 1440),
  reliability_threshold REAL CHECK (reliability_threshold IS NULL OR reliability_threshold BETWEEN 0 AND 1),
  window_start TIME,
  window_end TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE user_alerts OWNER TO app;
COMMENT ON TABLE user_alerts IS 'Configurable alerts for users';

CREATE TABLE user_offline_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  area_name TEXT,
  center_lat DOUBLE PRECISION CHECK (center_lat BETWEEN -90 AND 90),
  center_lng DOUBLE PRECISION CHECK (center_lng BETWEEN -180 AND 180),
  radius_km INT CHECK (radius_km BETWEEN 1 AND 500),
  size_bytes BIGINT CHECK (size_bytes IS NULL OR size_bytes >= 0),
  status download_status NOT NULL DEFAULT 'pending',
  checksum TEXT,
  last_update TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE user_offline_maps OWNER TO app;
COMMENT ON TABLE user_offline_maps IS 'Offline map downloads for users';

CREATE TABLE user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE user_notes OWNER TO app;
COMMENT ON TABLE user_notes IS 'Free-form notes created by users';

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('s3','gcs','local')),
  bucket TEXT,
  object_key TEXT,
  file_url TEXT,
  mime_type TEXT,
  size_bytes BIGINT CHECK (size_bytes >= 0),
  width INT,
  height INT,
  etag TEXT,
  sha256 TEXT,
  taken_at TIMESTAMPTZ,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE files OWNER TO app;
COMMENT ON TABLE files IS 'Metadata for user uploaded files stored externally';

CREATE TABLE note_photos (
  note_id UUID NOT NULL REFERENCES user_notes(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  PRIMARY KEY (note_id, file_id)
);
ALTER TABLE note_photos OWNER TO app;
COMMENT ON TABLE note_photos IS 'Photos attached to notes';

-- ===================================================================
-- Additional domain tables derived from project sources
-- ===================================================================
CREATE TABLE mushrooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latin TEXT,
  edible BOOLEAN NOT NULL,
  season TEXT,
  habitat TEXT,
  weather_ideal TEXT,
  description TEXT,
  culinary TEXT,
  cooking_tips TEXT,
  dishes TEXT[],
  confusions TEXT[],
  picking TEXT,
  photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mushrooms OWNER TO app;
COMMENT ON TABLE mushrooms IS 'Reference data for mushroom species';

CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  trend TEXT,
  lat DOUBLE PRECISION NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng DOUBLE PRECISION NOT NULL CHECK (lng BETWEEN -180 AND 180),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE zones OWNER TO app;
COMMENT ON TABLE zones IS 'Geographic zones with aggregated species scores';

CREATE TABLE zone_species (
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  mushroom_id TEXT NOT NULL REFERENCES mushrooms(id) ON DELETE RESTRICT,
  abundance INT NOT NULL CHECK (abundance BETWEEN 0 AND 100),
  PRIMARY KEY (zone_id, mushroom_id)
);
ALTER TABLE zone_species OWNER TO app;
COMMENT ON TABLE zone_species IS 'Species abundance scores per zone';

CREATE TABLE user_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  cover_file_id UUID REFERENCES files(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 0 AND 5),
  last_visit TIMESTAMPTZ,
  location TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE user_spots OWNER TO app;
COMMENT ON TABLE user_spots IS 'User-defined mushroom hunting spots';

CREATE TABLE spot_species (
  spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
  mushroom_id TEXT NOT NULL REFERENCES mushrooms(id) ON DELETE RESTRICT,
  PRIMARY KEY (spot_id, mushroom_id)
);
ALTER TABLE spot_species OWNER TO app;
COMMENT ON TABLE spot_species IS 'Species associated with a spot';

CREATE TABLE spot_photos (
  spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  PRIMARY KEY (spot_id, file_id)
);
ALTER TABLE spot_photos OWNER TO app;
COMMENT ON TABLE spot_photos IS 'Photos attached to spots';

CREATE TABLE spot_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID NOT NULL REFERENCES user_spots(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating INT CHECK (rating BETWEEN 0 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE spot_visits OWNER TO app;
COMMENT ON TABLE spot_visits IS 'History of visits for a spot';

CREATE TABLE spot_visit_photos (
  visit_id UUID NOT NULL REFERENCES spot_visits(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  PRIMARY KEY (visit_id, file_id)
);
ALTER TABLE spot_visit_photos OWNER TO app;
COMMENT ON TABLE spot_visit_photos IS 'Photos attached to individual spot visits';

-- ===================================================================
-- Indices
-- ===================================================================
CREATE INDEX idx_user_alerts_user ON user_alerts(user_id);
CREATE INDEX idx_maps_user ON user_offline_maps(user_id);
CREATE INDEX idx_notes_user ON user_notes(user_id);
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_files_taken_at ON files(taken_at);
CREATE INDEX idx_files_geo ON files(lat, lng);
CREATE INDEX idx_zone_species_zone ON zone_species(zone_id);
CREATE INDEX idx_user_spots_user ON user_spots(user_id);
CREATE INDEX idx_spot_visits_spot ON spot_visits(spot_id);

-- ===================================================================
-- Triggers: updated_at
-- ===================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
ALTER FUNCTION set_updated_at() OWNER TO app;

CREATE TRIGGER t_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER t_settings_updated BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER t_maps_updated BEFORE UPDATE ON user_offline_maps FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER t_notes_updated BEFORE UPDATE ON user_notes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER t_spots_updated BEFORE UPDATE ON user_spots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER t_visits_updated BEFORE UPDATE ON spot_visits FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===================================================================
-- Views
-- ===================================================================
CREATE VIEW v_user_profile AS
  SELECT u.id, u.email, u.display_name, u.language, u.units, u.subscription, u.subscription_expiry,
         s.theme, s.notifications_enabled
  FROM users u
  LEFT JOIN user_settings s ON s.user_id = u.id;
ALTER VIEW v_user_profile OWNER TO app;

COMMIT;
