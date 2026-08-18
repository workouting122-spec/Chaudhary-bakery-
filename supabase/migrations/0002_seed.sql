-- Seed the catalogue with the PRD's starter products.
insert into public.categories (name, slug, sort_order) values
  ('Cakes','cakes',1),
  ('Pastries','pastries',2),
  ('Cookies & Cupcakes','cookies-cupcakes',3),
  ('Breads','breads',4)
on conflict (slug) do nothing;

with c as (select id, slug from public.categories)
insert into public.products (name, slug, description, category_id, is_bestseller, is_new, tags)
values
  ('Classic Vanilla Truffle','classic-vanilla-truffle','Soft eggless vanilla sponge layered with silky vanilla truffle.',(select id from c where slug='cakes'), true, false, '{bestseller}'),
  ('Rich Belgian Chocolate','rich-belgian-chocolate','Deep Belgian chocolate sponge with a molten-style ganache.',(select id from c where slug='cakes'), true, false, '{bestseller}'),
  ('Red Velvet Dream','red-velvet-dream','Velvety red sponge with cream-cheese-style eggless frosting.',(select id from c where slug='cakes'), false, true, '{new}'),
  ('Fresh Fruit Gateau','fresh-fruit-gateau','Light sponge, fresh cream and seasonal fruit.',(select id from c where slug='cakes'), false, false, '{}'),
  ('Butterscotch Crunch','butterscotch-crunch','Butterscotch cream with a praline crunch.',(select id from c where slug='cakes'), false, false, '{}'),
  ('Black Forest Classic','black-forest-classic','Chocolate sponge, cherries and cream — the timeless favourite.',(select id from c where slug='cakes'), true, false, '{bestseller}')
on conflict (slug) do nothing;

-- variants (500g / 1kg) for each seeded product
insert into public.product_variants (product_id, weight_label, price, stock_qty, sort_order)
select p.id, '500g', round(base*0.55), 20, 1 from (
  select id, (case slug
    when 'classic-vanilla-truffle' then 649
    when 'rich-belgian-chocolate' then 749
    when 'red-velvet-dream' then 799
    when 'fresh-fruit-gateau' then 699
    when 'butterscotch-crunch' then 649
    when 'black-forest-classic' then 699 end)::numeric as base, slug
  from public.products) p where p.base is not null;

insert into public.product_variants (product_id, weight_label, price, stock_qty, sort_order)
select p.id, '1kg', base, 15, 2 from (
  select id, (case slug
    when 'classic-vanilla-truffle' then 649
    when 'rich-belgian-chocolate' then 749
    when 'red-velvet-dream' then 799
    when 'fresh-fruit-gateau' then 699
    when 'butterscotch-crunch' then 649
    when 'black-forest-classic' then 699 end)::numeric as base, slug
  from public.products) p where p.base is not null;
