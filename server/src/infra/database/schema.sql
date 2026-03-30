create extension IF not exists citext;

create table admins (
  id uuid primary key default gen_random_uuid (),
  email citext unique not null,
  role text not null check (role in ('admin', 'dept')),
  password_hash text not null,
  created_at TIMESTAMPTZ default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid (),
  name citext not null,
  email citext unique not null,
  roll_no text unique not null,
  abc_id text not null,
  enroll_id text not null,
  batch smallint not null,
  branch citext not null,
  created_at timestamp default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references students (id) on delete cascade,
  semester smallint not null check (semester between 1 and 8),
  exam_type citext not null check (exam_type in ('Regular', 'Backlog')),
  attempt_no smallint not null check (attempt_no between 1 and 4),
  view_type citext not null check (view_type in ('VALUATION', 'RTRV', 'RRV')),
  exam_session citext not null check (exam_session in ('Apr-May', 'Nov-Dec')),
  exam_year smallint not null,
  created_at timestamp default now(),
  constraint regular_is_always_attempt_1 check (
    exam_type != 'Regular'
    or attempt_no = 1
  ),
  unique (student_id, semester, exam_type, attempt_no, view_type)
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid (),
  code text not null unique,
  name citext not null,
  max_ese smallint,
  max_ct smallint,
  max_ta smallint,
  max_total smallint not null,
  created_at timestamp default now()
);

create table if not exists overall_results (
  id uuid primary key default gen_random_uuid (),
  attempt_id uuid not null unique references attempts (id) on delete cascade,
  spi numeric(4, 2),
  overall_max smallint not null,
  overall_obt smallint not null,
  overall_status citext not null check (
    overall_status in (
      'Pass',
      'Pass By Grace',
      'RV-Pass',
      'RV-Pass By Grace',
      'RRV-PASS',
      'RRV-Pass By Grace',
      'Fail',
      'RV-Fail',
      'RRV-Fail'
    )
  ),
  created_at timestamp default now()
);

create table if not exists subject_results (
  id uuid primary key default gen_random_uuid (),
  attempt_id uuid not null references attempts (id) on delete cascade,
  subject_id uuid not null references subjects (id),
  obt_ese smallint,
  obt_ct smallint,
  obt_ta smallint,
  obt_total smallint not null,
  status citext not null check (status in ('Pass', 'Pass By Grace', 'Fail')),
  created_at timestamp default now(),
  unique (attempt_id, subject_id)
);


create table if not exists refresh_tokens (
  id uuid primary key default gen_random_uuid (),
  student_id uuid not null references students (id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamp not null,
  revoked_at timestamp,
  created_at timestamp not null default now(),
  check (expires_at > created_at)
);