-- =========================================
-- AUTO CREATE PROFILE
-- =========================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  insert into public.profiles (
    id,
    email,
    full_name
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );

  insert into public.user_progress (
    user_id
  )
  values (
    new.id
  );

  insert into public.user_settings (
    user_id
  )
  values (
    new.id
  );

  insert into public.subscriptions (
    user_id,
    plan,
    status
  )
  values (
    new.id,
    'free',
    'active'
  );

  return new;
end;
$$;

-- =========================================
-- TRIGGER
-- =========================================

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();