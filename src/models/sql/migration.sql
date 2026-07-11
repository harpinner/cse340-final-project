-- Database migration for Large Motors (PostgreSQL)
-- Updated to match the new schema: categories + vehicles.category_id,
-- and a service_cat enum backing the new service_types table.
--
-- One ordering fix vs. the schema as given: `categories` must be created
-- before `vehicles`, since vehicles.category_id references categories(id).
-- Postgres won't let a table reference another table that doesn't exist
-- yet, so categories moves up. Everything else is unchanged from the
-- schema you provided.

BEGIN;

CREATE TYPE service_cat AS ENUM (
    'maintenance',
    'repair',
    'inspection',
    'seasonal'
);

CREATE TABLE categories (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text NOT NULL UNIQUE,
    description text
);

CREATE TABLE vehicles (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    make        text NOT NULL,
    model       text NOT NULL,
    year        integer NOT NULL,
    price       numeric(10, 2) NOT NULL,
    category_id integer REFERENCES categories(id),
    description text
);

CREATE TABLE users (
    id       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    role     text NOT NULL,
    email    text NOT NULL UNIQUE
);

CREATE TABLE reviews (
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vehicle_id integer NOT NULL REFERENCES vehicles(id),
    user_id    integer NOT NULL REFERENCES users(id),
    rating     integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment    text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title      text NOT NULL,
    content    text NOT NULL,
    author_id  integer NOT NULL REFERENCES users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_comments (
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id    integer NOT NULL REFERENCES blog_posts(id),
    user_id    integer NOT NULL REFERENCES users(id),
    comment    text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_requests (
    id           integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vehicle_id   integer NOT NULL REFERENCES vehicles(id),
    user_id      integer NOT NULL REFERENCES users(id),
    service_type text NOT NULL,
    description  text,
    status       text NOT NULL,
    created_at   timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    integer NOT NULL REFERENCES users(id),
    message    text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_images (
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    vehicle_id integer NOT NULL REFERENCES vehicles(id),
    image_url  text NOT NULL
);

CREATE TABLE service_types (
    id       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     text NOT NULL,
    category service_cat NOT NULL
);

-- ---------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------

-- Categories: one per body style currently on the lot
INSERT INTO categories (name, description) VALUES
    ('Coupe', 'Two-door vehicles, sold with varying degrees of remaining door'),
    ('Sedan', 'Four-door daily drivers, church-adjacent mileage not guaranteed'),
    ('Wagon', 'Cargo space up front, character in the back'),
    ('SUV',   'Four doors, four tires, one steering wheel');

-- Vehicles: current lot inventory, linked to the categories above
INSERT INTO vehicles (make, model, year, price, category_id, description) VALUES
    ('Meridian',  'Coupe', 2011, 2995.00,
        (SELECT id FROM categories WHERE name = 'Coupe'),
        'Runs when warm, cold, or medium. Aftermarket duct-tape trim, matches interior. Comes with the good spare, not the donut.'),
    ('Highline',  'Sedan', 2014, 4400.00,
        (SELECT id FROM categories WHERE name = 'Sedan'),
        'Only driven to church, allegedly. Minor sunroof (permanently open). Brakes make a sound that means it''s working.'),
    ('Vandale',   'Wagon', 2008, 1750.00,
        (SELECT id FROM categories WHERE name = 'Wagon'),
        'Some rust is structural, some is decorative. Radio only plays AM, which builds character. Never been in an accident we know about.'),
    ('Cresthill', 'SUV',   2016, 6800.00,
        (SELECT id FROM categories WHERE name = 'SUV'),
        'Four doors, four tires, one steering wheel. Recently detailed to remove evidence. Backed by our famous handshake guarantee.');

-- Vehicle photos
INSERT INTO vehicle_images (vehicle_id, image_url) VALUES
    ((SELECT id FROM vehicles WHERE make = 'Meridian'),  '/images/vehicles/meridian-coupe-2011.jpg'),
    ((SELECT id FROM vehicles WHERE make = 'Highline'),  '/images/vehicles/highline-sedan-2014.jpg'),
    ((SELECT id FROM vehicles WHERE make = 'Vandale'),   '/images/vehicles/vandale-wagon-2008.jpg'),
    ((SELECT id FROM vehicles WHERE make = 'Cresthill'), '/images/vehicles/cresthill-suv-2016.jpg');

-- Users: employee accounts + the customers referenced in the site's review
-- section. Passwords are REAL bcrypt hashes (cost factor 12) of the dummy
-- passwords noted in the trailing comments — for local dev/testing only.
INSERT INTO users (username, password, role, email) VALUES
    ('gary_sales',   '$2b$12$RAMdxTVULgPfO0FJygtUoeuRzhAkWTTz1.E4uArSeTa5KzIgTkvW.', 'employee',    'gary@largemotors.example'),   -- Skew1ed$Frame
    ('denise_ops',   '$2b$12$/WThGy6bVw1DJeYn7yshw.13udYC8D5wL5DSwqDaz9IWvTxM2lvne', 'employee',    'denise@largemotors.example'), -- Cl1pboard!Ops
    ('kevin_cr',     '$2b$12$uSrkI6kmzLkfAmihchc2euNxMStiXYGMC9BzVQfkmtuixPg0OBIbS', 'employee',    'kevin@largemotors.example'),  -- Deflect0r#99
    ('marcus_sales', '$2b$12$KsTEOoUvjyznHQY5Mg6Q.e9IQuc19gGjDQ7G5.fC5RIJ6dsG3tq0e', 'employee',    'marcus.s@largemotors.example'), -- ElevenCars!Q2
    ('admin',        '$2b$12$I/UA6/GvhLD6dNE0vac6wOkc8Bs9D2FFJ5GEytY3d/AMbQFduBPZ6', 'admin',    'admin@largemotors.example'),  -- Adm1n$LotKeys
    ('dana_r',       '$2b$12$wEsvfcD0QcnIVilT0/0rBetOgcIsUEazS7rkJxfS37IuBqyWjTLXy', 'customer', 'dana.r@example.com'),         -- Transm1ssion!
    ('marcus_t',     '$2b$12$jYd.6HPUIxelnVBaYPzmDOYJEteIHzSWler5u4mB2fihxngkuIug2', 'customer', 'marcus.t@example.com'),       -- LawyerUp#42
    ('priya_k',      '$2b$12$uZpLt8vz/1vTCqnbsMBRSOqsUlmoTbIOqM1PHJUYg2odil7mKx0OW', 'customer', 'priya.k@example.com'),        -- ThreeStars!OK
    ('big_sal',      '$2b$12$Xiswt7AQd/IZQnlWiuPMb.v5U/.XKbLNnFgBst0dbG3shS/ebYMoG', 'customer', 'sal@example.com'),            -- Neighborhood$1
    ('jenny_o',      '$2b$12$c3UMGIx9ngIiHUn/lAPwweiBNHP3SgRfV915qt7Pnv9xb6rzU4puG', 'customer', 'jenny.o@example.com'),        -- AttorneyGen!22
    ('tom_w',        '$2b$12$GisBzIWOAuKM9b9m0PofRu/4bdEc7TeG52mzxvk5OAFfhPIn17CtC', 'customer', 'tom.w@example.com');          -- ManagedExp3ct

-- Reviews for the Meridian Coupe, matching the site's vehicle detail page
INSERT INTO reviews (vehicle_id, user_id, rating, comment) VALUES
    ((SELECT id FROM vehicles WHERE make = 'Meridian'), (SELECT id FROM users WHERE username = 'dana_r'), 1,
        'The transmission gave out eleven days after I drove it off the lot. Eleven days. I called and the guy told me "that''s basically new car territory for us." I am never doing business here again and I am telling everyone I know.'),
    ((SELECT id FROM vehicles WHERE make = 'Meridian'), (SELECT id FROM users WHERE username = 'marcus_t'), 1,
        'This car is an absolute piece of junk and you people knew it when you sold it to me. My lawyer already has the paperwork drawn up and I will see every one of you in court.'),
    ((SELECT id FROM vehicles WHERE make = 'Meridian'), (SELECT id FROM users WHERE username = 'priya_k'), 3,
        'Honestly it''s fine? The AC doesn''t work and there''s a smell I''ve stopped asking about, but it gets me to work. Salesman was funny at least.'),
    ((SELECT id FROM vehicles WHERE make = 'Meridian'), (SELECT id FROM users WHERE username = 'big_sal'), 2,
        'Two stars, and that''s me being generous out of respect for the neighborhood. My cousin bought this car for his daughter and the brakes went out on the Whitfield off-ramp.'),
    ((SELECT id FROM vehicles WHERE make = 'Meridian'), (SELECT id FROM users WHERE username = 'jenny_o'), 1,
        'Sold me a car with a cracked frame and told me it was "cosmetic." Filed a complaint with the state attorney general''s consumer protection office.'),
    ((SELECT id FROM vehicles WHERE make = 'Meridian'), (SELECT id FROM users WHERE username = 'tom_w'), 4,
        'Look, I knew what I was getting into. Bought it cheap, it''s lasted longer than the guys at the lot even implied it would.');

-- Blog posts, matching the internal blog page
INSERT INTO blog_posts (title, content, author_id) VALUES
    ('A Reminder About the Word ''Certified''',
     'We''ve had some questions from the team about what ''Certified Pre-Owned'' means on our signage. To clarify: it means a certificate was, at some point, near the car. Please continue using this language freely, it tests very well with customers.',
     (SELECT id FROM users WHERE username = 'gary_sales')),
    ('Lot Cleanup Before Saturday Walk-Ins',
     'Big walk-in crowd expected Saturday. Move the Vandale Wagon away from the Cresthill so customers can''t hear them next to each other, and re-prop the hoods that fell overnight.',
     (SELECT id FROM users WHERE username = 'denise_ops')),
    ('Congrats to Marcus on Q2''s Top Seller!',
     'Big shoutout to Marcus for moving eleven vehicles this quarter, a company record, including three that had been on the lot since before most of you started.',
     (SELECT id FROM users WHERE username = 'gary_sales')),
    ('Update on the Vandale Wagon Return',
     'Following up on the review situation from last week. We''ve reached an understanding with the customer and everyone involved is satisfied with the resolution.',
     (SELECT id FROM users WHERE username = 'kevin_cr'));

-- Service type catalog
INSERT INTO service_types (name, category) VALUES
    ('Oil Change',                'maintenance'),
    ('Tire Rotation',             'maintenance'),
    ('Brake Pad Replacement',     'repair'),
    ('Transmission Repair',       'repair'),
    ('Pre-Purchase Inspection',   'inspection'),
    ('State Safety Inspection',   'inspection'),
    ('Winter Tire Swap',          'seasonal'),
    ('AC Recharge',               'seasonal');

COMMIT;

-- ---------------------------------------------------------------------
-- Additional questionable vehicles for the Large Motors inventory
-- ---------------------------------------------------------------------
BEGIN;

-- Insert five new vehicles of dubious distinction
INSERT INTO vehicles (make, model, year, price, category_id, description) VALUES
    ('Bastion',   'Pillar',   2009, 2150.00,
        (SELECT id FROM categories WHERE name = 'Sedan'),
        'Features unique two-tone paint (silver and oxidation). AC works, but only when you are driving downhill. The driver''s door sags, but Gary says it "adds character." Mismatched tires included.'),
    ('Kodiak',    'Forester', 2005, 1499.00,
        (SELECT id FROM categories WHERE name = 'SUV'),
        'Well-loved interior with custom "pet odor" patina. The check engine light is taped over, but we assure you it''s just a suggestion. Runs rough, but it runs. Bring your own battery.'),
    ('Aethel',    'Sport',    2012, 3800.00,
        (SELECT id FROM categories WHERE name = 'Coupe'),
        'Sleek and sporty, once. The passenger window is permanently down (good for summer!). Transmission hesitates, but eventually gets the idea. The title is "mostly" clean.'),
    ('Vandale',   'Cruiser',  2001, 995.00,
        (SELECT id FROM categories WHERE name = 'Wagon'),
        'Classic wagon profile. We think it used to be blue. Some surface rust, some structural rust. We haven''t actually started it in six months, but Kevin said it "purred like a kitten" then.'),
    ('Highline',  'Classic',  1998, 750.00,
        (SELECT id FROM categories WHERE name = 'Sedan'),
        'The definition of a "mechanic''s special." Needs everything. It doesn''t run, it doesn''t stop, but the radio works. Perfect project car, or yard art.');

-- Insert corresponding photos for these new entries
INSERT INTO vehicle_images (vehicle_id, image_url) VALUES
    ((SELECT id FROM vehicles WHERE make = 'Bastion'   AND model = 'Pillar'),   '/images/vehicles/bastion-pillar-2009-1.png'),
    ((SELECT id FROM vehicles WHERE make = 'Kodiak'    AND model = 'Forester'), '/images/vehicles/kodiak-forester-2005-1.png'),
    ((SELECT id FROM vehicles WHERE make = 'Aethel'    AND model = 'Sport'),    '/images/vehicles/aethel-sport-2012-1.jpg'),
    ((SELECT id FROM vehicles WHERE make = 'Vandale'   AND model = 'Cruiser'),  '/images/vehicles/vandale-cruiser-2001-1.png'),
    ((SELECT id FROM vehicles WHERE make = 'Highline'  AND model = 'Classic'),  '/images/vehicles/highline-classic-1998-1.png');

COMMIT;
