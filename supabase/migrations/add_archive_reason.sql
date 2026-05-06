ALTER TABLE goals
ADD COLUMN archive_reason text CHECK (archive_reason IN ('expired', 'manual'));
