-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  timezone text default 'UTC',
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GOALS (Long-term objectives)
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  target_date date,
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MILESTONES (Sub-goals)
create table public.milestones (
  id uuid default uuid_generate_v4() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  title text not null,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- HABITS (Recurring daily actions)
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  frequency text default 'daily', -- Can be expanded later
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TASKS (Actionable items)
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal_id uuid references public.goals(id) on delete set null,
  milestone_id uuid references public.milestones(id) on delete set null,
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  status text check (status in ('todo', 'in_progress', 'done', 'cancelled')) default 'todo',
  scheduled_date date,
  start_time time,
  end_time time,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DAILY LOGS (End of day reflections and stats)
create table public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  log_date date not null,
  mood text,
  reflection text,
  ai_insights text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, log_date)
);

-- ROW LEVEL SECURITY (RLS) SETUP

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.milestones enable row level security;
alter table public.habits enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_logs enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Policies for goals
create policy "Users can view own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals for delete using (auth.uid() = user_id);

-- Policies for milestones
create policy "Users can view own milestones" on public.milestones for select using (
  exists (select 1 from public.goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);
create policy "Users can insert own milestones" on public.milestones for insert with check (
  exists (select 1 from public.goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);
create policy "Users can update own milestones" on public.milestones for update using (
  exists (select 1 from public.goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);
create policy "Users can delete own milestones" on public.milestones for delete using (
  exists (select 1 from public.goals where goals.id = milestones.goal_id and goals.user_id = auth.uid())
);

-- Policies for habits
create policy "Users can view own habits" on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on public.habits for delete using (auth.uid() = user_id);

-- Policies for tasks
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

-- Policies for daily_logs
create policy "Users can view own daily logs" on public.daily_logs for select using (auth.uid() = user_id);
create policy "Users can insert own daily logs" on public.daily_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own daily logs" on public.daily_logs for update using (auth.uid() = user_id);
create policy "Users can delete own daily logs" on public.daily_logs for delete using (auth.uid() = user_id);

-- AUTOMATIC PROFILE CREATION TRIGGER
-- When a user signs up, insert a profile row

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
