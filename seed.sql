BEGIN;

-- Seed users
INSERT INTO users(email,password_hash,display_name,language,units,subscription)
VALUES
('demo@example.com','{hash}','Demo','fr','metric','free'),
('premium@example.com','{hash}','Premium','fr','metric','premium');

-- Seed settings
INSERT INTO user_settings(user_id,theme,notifications_enabled)
SELECT id,'system',true FROM users;

-- Seed alerts for first user
INSERT INTO user_alerts(user_id,type,enabled,radius_km,frequency_minutes)
SELECT id,'optimum',true,50,60 FROM users LIMIT 1;

-- Seed initial note
INSERT INTO user_notes(user_id,title,content)
SELECT id,'Premier repère','Note de test en markdown.' FROM users LIMIT 1;

-- Reference data: mushrooms
INSERT INTO mushrooms(id,name,latin,edible,season,habitat,weather_ideal,description,culinary,cooking_tips,dishes,confusions,picking,photo)
VALUES
('cepe_de_bordeaux','Cèpe de Bordeaux','Boletus edulis',true,'Août – Novembre','Feuillus & conifères, sols acides, 200–1200 m, lisières et clairières','Pluies modérées suivies de 3–5 jours doux (12–20°C), vent faible','Chapeau brun-noisette, pied ventru réticulé, tubes blancs devenant verdâtres, chair blanche','Excellente. Poêlé, en fricassée, séchage possible','Saisir à feu vif dans un peu de matière grasse, ne pas laver à grande eau (brosse + chiffon)',ARRAY['Omelette aux cèpes','Poêlée de cèpes persillés','Tagliatelles aux cèpes','Cèpes rôtis au four'],ARRAY['Bolet amer (Tylopilus felleus)','Bolets à pores rouges (toxiques)'],'Couper au couteau, reboucher le trou, prélever raisonnablement','https://images.unsplash.com/photo-1603296196270-937b36cf47b1?q=80&w=1600&auto=format&fit=crop'),
('girolle','Girolle (Chanterelle)','Cantharellus cibarius',true,'Juin – Octobre','Bois de conifères & feuillus, mousses, pentes bien drainées','Alternance d''averses et de beaux jours, 14–22°C','Chapeau jaune cône-ombiliqué, plis décurrents, odeur fruitée d''abricot','Excellente. Sautés courts, risotto, pickles','Déposer en fin de cuisson pour conserver le croquant, éviter l''excès d''eau',ARRAY['Risotto aux girolles','Volaille sauce girolles','Tartine forestière','Pickles de girolles'],ARRAY['Clitocybe de l''olivier (toxique)','Fausse girolle (Hygrophoropsis aurantiaca)'],'Prélever les plus développées, laisser les jeunes','https://images.unsplash.com/photo-1631460615580-bbbc9efeb800?q=80&w=1600&auto=format&fit=crop'),
('morille_commune','Morille commune','Morchella esculenta',true,'Mars – Mai','Lisières, vergers, ripisylves, sols calcaires','Redoux printanier après pluies, 8–18°C','Chapeau alvéolé en nid d''abeille, pied blanc-creme, chair creuse','Excellente mais toujours bien cuite','Sécher possible. Réhydrater puis cuire longuement. Jamais crue',ARRAY['Morilles à la crème','Poulet aux morilles','Pâtes aux morilles','Tartes salées aux morilles'],ARRAY['Gyromitre (toxique)','Morillons (autres Morchella)'],'Gants recommandés pour la cueillette; longue cuisson obligatoire','https://images.unsplash.com/photo-1587307360679-f20b5cbd9e03?q=80&w=1600&auto=format&fit=crop');

-- Zones
INSERT INTO zones(id,name,score,trend,lat,lng) VALUES
(gen_random_uuid(),'Clairière des Alpages',88,'⬈ amélioration',45.9,6.6),
(gen_random_uuid(),'Ripisylve du Vieux Pont',72,'⬊ en baisse',45.7,5.9),
(gen_random_uuid(),'Grande Lisière Sud',53,'→ stable',45.6,6.1);

-- Zone species scores
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'cepe_de_bordeaux',90 FROM zones z WHERE z.name='Clairière des Alpages';
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'girolle',75 FROM zones z WHERE z.name='Clairière des Alpages';
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'morille_commune',0 FROM zones z WHERE z.name='Clairière des Alpages';

INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'cepe_de_bordeaux',40 FROM zones z WHERE z.name='Ripisylve du Vieux Pont';
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'girolle',55 FROM zones z WHERE z.name='Ripisylve du Vieux Pont';
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'morille_commune',85 FROM zones z WHERE z.name='Ripisylve du Vieux Pont';

INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'cepe_de_bordeaux',60 FROM zones z WHERE z.name='Grande Lisière Sud';
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'girolle',50 FROM zones z WHERE z.name='Grande Lisière Sud';
INSERT INTO zone_species(zone_id,mushroom_id,abundance)
SELECT z.id,'morille_commune',15 FROM zones z WHERE z.name='Grande Lisière Sud';

-- Demo spot for first user
INSERT INTO user_spots(user_id,zone_id,name,rating,last_visit)
SELECT u.id,z.id,'Spot démo',5,now()
FROM users u
JOIN zones z ON z.name='Clairière des Alpages'
LIMIT 1;

INSERT INTO spot_species(spot_id,mushroom_id)
SELECT s.id,'cepe_de_bordeaux' FROM user_spots s LIMIT 1;

INSERT INTO spot_visits(spot_id,visited_at,rating,note)
SELECT s.id,now(),5,'Première cueillette' FROM user_spots s LIMIT 1;

COMMIT;
