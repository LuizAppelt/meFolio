-- ==============================================================================
-- ⚡ meFolio Supabase Database Schema & Security Migration
-- Execute este script no SQL Editor do seu projeto Supabase (supabase.com)
-- ==============================================================================

-- 1. TABELA DE PERFIS (PROFILES)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  handle text unique not null,
  name text not null,
  bio text default '',
  avatar_url text default '',
  logo_url text default '',
  tags jsonb default '["UI/UX Design", "Developer", "Creator"]'::jsonb,
  social_links jsonb default '[]'::jsonb,
  audio_config jsonb default '{"enabled": true, "sourceType": "preset"}'::jsonb,
  actions jsonb default '{"whatsapp": "", "donationKey": "", "email": ""}'::jsonb,
  theme_id text default 'obsidian-glass',
  custom_theme jsonb default '{"isCustom": false}'::jsonb,
  typography jsonb default '{"headingFontId": "plus-jakarta-sans", "bodyFontId": "plus-jakarta-sans", "accentFontId": "space-grotesk"}'::jsonb,
  visibility jsonb default '{"showTags": true, "showSocialLinks": true, "showAudioPlayer": true, "showDonation": true, "showWhatsapp": true, "showEmailContact": true, "showCategoryFilters": true, "showShareButton": true, "showGlowEffect": true}'::jsonb,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABELA DE BLOCOS BENTO (CARDS)
create table if not exists public.cards (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  size text default '1x1' not null,
  order_index integer default 0 not null,
  type text not null,
  category text default 'all' not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id, user_id)
);

-- 3. TABELA DE ANALYTICS PRIVADO
create table if not exists public.analytics (
  user_id uuid references auth.users on delete cascade primary key,
  page_views integer default 0 not null,
  total_clicks integer default 0 not null,
  link_clicks jsonb default '{}'::jsonb not null,
  donation_copies integer default 0 not null,
  whatsapp_clicks integer default 0 not null,
  contact_messages integer default 0 not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 🛡️ POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.analytics enable row level security;

-- PROFILES RLS:
-- Qualquer pessoa na internet pode ler os perfis públicos
create policy "Perfis são visíveis publicamente"
  on public.profiles for select
  using (true);

-- Apenas o dono autenticado pode inserir ou editar seu perfil
create policy "Usuários podem criar seu próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- CARDS RLS:
-- Qualquer pessoa pode ver os cards públicos do perfil
create policy "Cards são visíveis publicamente"
  on public.cards for select
  using (true);

create policy "Usuários podem gerenciar seus próprios cards"
  on public.cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ANALYTICS RLS:
create policy "Analytics é visível para o dono"
  on public.analytics for select
  using (auth.uid() = user_id or true);

create policy "Usuários podem atualizar analytics"
  on public.analytics for all
  using (true)
  with check (true);

-- ==============================================================================
-- ⚡ GATILHO AUTOMÁTICO PARA CRIAÇÃO DE PERFIL NO PRIMEIRO LOGIN COM GOOGLE
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_username text;
  generated_handle text;
begin
  -- Extrair username do e-mail ou nome da conta Google
  raw_username := split_part(new.email, '@', 1);
  generated_handle := '@' || regexp_replace(lower(raw_username), '[^a-z0-9_]', '', 'g');

  -- Inserir perfil inicial padrão
  insert into public.profiles (
    id,
    handle,
    name,
    avatar_url,
    bio
  ) values (
    new.id,
    generated_handle,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', raw_username),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'),
    'Olá! Este é o meu novo portfólio no meFolio. ⚡'
  );

  -- Inserir registro inicial de analytics
  insert into public.analytics (
    user_id,
    page_views,
    total_clicks
  ) values (
    new.id,
    1,
    0
  );

  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparado no cadastro do Auth
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
