-- SQL Statements to Add HCMC Mock Data
-- Run these in your Supabase SQL Editor
-- HCMC City ID: 6667f0e7-f9c0-439d-abe1-029ad8f45093

-- ====================================
-- 1. LOCAL INTEL DATA (18 records)
-- ====================================

INSERT INTO local_intel_data (city_id, category, tip_text, contributor_count, source, last_updated) VALUES

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Transportation', 'Download Grab for safe motorbike taxi rides. Never pay more than 50,000 VND ($2) for rides within District 1. Avoid rush hours (7-9am, 5-7pm) when traffic is unbearable.', 127, 'Teacher Community', '2024-01-15'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Transportation', 'Rent a motorbike for $60-80/month from expat-friendly shops in District 1. You''ll need your passport, a deposit, and basic Vietnamese traffic knowledge. Helmets are mandatory.', 89, 'Expat Teachers', '2024-01-10'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Banking', 'Vietcombank and HSBC are most foreigner-friendly for opening accounts. Bring your work permit, passport, and school letter. Monthly fees are around 50,000 VND ($2).', 156, 'International Teacher Network', '2024-01-20'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Banking', 'ATMs charge 22,000 VND ($1) per withdrawal. Sacombank ATMs often have the best exchange rates. Always withdraw large amounts to minimize fees.', 201, 'HCMC Expats', '2024-01-08'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Shopping', 'Annam Gourmet has Western groceries but expect 3x prices. Go to Ben Thanh Market early morning for fresh produce at local prices. Saigon Square is great for cheap knockoffs.', 143, 'Teacher Reviews', '2024-01-12'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Shopping', 'Landmark 81''s Vinmart has quality imported goods. Diamond Plaza and Saigon Centre have international brands. Avoid tourist traps in District 1''s main streets.', 78, 'Expat Community', '2024-01-18'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Dining', 'Pho 2000 is touristy but good. For authentic local food, try street stalls in District 3. Always point at what you want and have Google Translate ready.', 234, 'Foodie Teachers', '2024-01-14'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Dining', 'Grab Food delivers everywhere for 15,000-25,000 VND ($0.65-1). Foody is cheaper but Vietnamese-only interface. Western food costs $8-15, local food $2-5.', 167, 'Digital Nomads', '2024-01-16'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Housing', 'District 2 (Thu Duc) is expensive but expat-heavy. District 7 has good international schools. District 1 is central but noisy. Budget $400-800/month for decent places.', 189, 'Housing Group', '2024-01-22'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Housing', 'Always negotiate rent down by 10-20%. Check for water damage during rainy season. Get a local friend to help with contracts to avoid foreigner pricing scams.', 134, 'Apartment Hunters', '2024-01-11'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Cultural Tips', 'Learn basic Vietnamese numbers and ''cam on'' (thank you). Dress modestly when visiting temples. Never point with one finger - use open hand or point with lips.', 276, 'Cultural Exchange', '2024-01-09'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Cultural Tips', 'Gift-giving is important in Vietnamese culture. Avoid gifts in sets of four (unlucky number). Business cards are exchanged with both hands and a slight bow.', 98, 'Business Etiquette', '2024-01-17'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Practical', 'Get a Viettel SIM card - best coverage and data packages. 4G data plans cost 70,000-200,000 VND ($3-8.50)/month. Buy at official stores with passport.', 245, 'Tech Savvy Expats', '2024-01-13'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Practical', 'Download these essential apps: Grab (transport), Zalo (local WhatsApp), Grab Food (delivery), Google Translate with Vietnamese offline pack, and XE Currency.', 312, 'App Recommendations', '2024-01-19'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Healthcare', 'FV Hospital in District 7 is expensive but has English-speaking doctors. Cho Ray Hospital is local and cheap but language barriers exist. Get health insurance first.', 156, 'Healthcare Experiences', '2024-01-21'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Safety', 'HCMC is generally safe but watch for bag snatchers on motorbikes. Keep valuables in front pockets. Avoid flashing expensive phones/jewelry in crowded areas.', 187, 'Safety Network', '2024-01-07'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Weather', 'Rainy season (May-Oct) floods streets daily around 4-6pm. Always carry rain gear. Dry season (Nov-Apr) can hit 38°C - invest in good AC and stay hydrated.', 203, 'Weather Watchers', '2024-01-06'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Nightlife', 'Bui Vien Walking Street is backpacker central but fun. Sky bars in District 1 offer great views but expensive drinks ($8-12). Local bia hoi costs $0.50-1 per beer.', 145, 'Social Scene', '2024-01-05');

-- ====================================
-- 2. CITY APPS (5 records)
-- ====================================

INSERT INTO city_apps (city_id, name, type, description, url) VALUES

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Grab', 'Transportation & Food Delivery', 'Essential for safe motorbike taxis, car rides, and food delivery. Works in English and accepts international cards.', 'https://www.grab.com/vn/en/'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Zalo', 'Messaging', 'Vietnam''s WhatsApp. Essential for communicating with locals, landlords, and joining expat groups.', 'https://zalo.me'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Foody', 'Food Delivery', 'Cheaper alternative to Grab Food with more local restaurant options. Interface in Vietnamese only.', 'https://www.foody.vn'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Be Group', 'Transportation', 'Local alternative to Grab with competitive pricing. Good for motorbike and car rides.', 'https://be.com.vn'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Viettel Money', 'Mobile Payments', 'Mobile wallet for paying bills, topping up phone credit, and cashless payments at many venues.', 'https://viettelmoney.vn');

-- ====================================
-- 3. HOUSING WEBSITES (4 records)
-- ====================================

INSERT INTO housing_websites (city_id, name, url, type, description) VALUES

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Batdongsan.com.vn', 'https://batdongsan.com.vn', 'Rental', 'Vietnam''s largest property portal. Mix of Vietnamese and some English listings. Good for finding apartments.'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Saigon Expat Housing', 'https://www.facebook.com/groups/saigonexpathomes', 'Rental', 'Facebook group specifically for expats. English-speaking landlords and fair pricing for foreigners.'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'HCMC Apartments for Rent', 'https://www.facebook.com/groups/hcmcapartments', 'Rental', 'Active Facebook group with daily postings. Good for short-term and furnished rentals.'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'District 2 Housing', 'https://www.facebook.com/groups/district2housing', 'Rental', 'Focused on expat-heavy District 2 (Thu Duc). Higher prices but Western amenities and English support.');

-- ====================================
-- 4. AIR QUALITY (12 records)
-- ====================================

INSERT INTO air_quality (city_id, month, aqi, status) VALUES

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'January', 89, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'February', 92, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'March', 105, 'Unhealthy for Sensitive'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'April', 110, 'Unhealthy for Sensitive'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'May', 95, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'June', 88, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'July', 82, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'August', 85, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'September', 91, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'October', 98, 'Moderate'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'November', 103, 'Unhealthy for Sensitive'),
('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'December', 94, 'Moderate');

-- ====================================
-- 5. CITY NEWS (4 records)
-- ====================================

INSERT INTO city_news (city_id, headline, category, date, summary, relevance_to_teachers, source_url) VALUES

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'New Metro Line 1 Opens, Reducing Traffic Congestion for Teachers', 'Transportation', '2024-01-15', 'The long-awaited Ben Thanh - Suoi Tien Metro Line finally opens, offering teachers a reliable alternative to motorbike taxis during peak hours.', 'High - provides safe, affordable transport to schools in Districts 1, 2, and 9', 'https://vnexpress.net/metro-line-1-opens'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'International Schools Report Teacher Shortage, Salary Increases Expected', 'Employment', '2024-01-12', 'Several international schools in HCMC are raising salaries 10-15% to attract qualified foreign teachers amid growing enrollment.', 'Very High - direct impact on salary negotiations and job opportunities', 'https://saigonneer.com/teacher-shortage-2024'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'New Visa Regulations Streamline Work Permit Process for Foreign Teachers', 'Legal/Visa', '2024-01-08', 'Vietnam''s Ministry of Education announces simplified work permit applications, reducing processing time from 6 weeks to 3 weeks.', 'High - affects all foreign teachers seeking work permits', 'https://vietnamnews.vn/work-permit-changes'),

('6667f0e7-f9c0-439d-abe1-029ad8f45093', 'Air Quality Monitoring System Expanded Across HCMC Districts', 'Health/Environment', '2024-01-10', 'City installs 50 new air quality monitors, with data available via mobile apps to help residents plan outdoor activities.', 'Medium - helps plan school activities and daily commutes', 'https://tuoitrenews.vn/air-quality-monitors');

-- ====================================
-- VERIFICATION QUERIES
-- ====================================

-- After running the above, verify the data was inserted:

SELECT 'Local Intel' as table_name, COUNT(*) as records_count FROM local_intel_data WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
UNION ALL
SELECT 'City Apps', COUNT(*) FROM city_apps WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
UNION ALL
SELECT 'Housing Websites', COUNT(*) FROM housing_websites WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
UNION ALL
SELECT 'Air Quality', COUNT(*) FROM air_quality WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093'
UNION ALL
SELECT 'City News', COUNT(*) FROM city_news WHERE city_id = '6667f0e7-f9c0-439d-abe1-029ad8f45093';

-- Expected results:
-- Local Intel: 35 (17 existing + 18 new)
-- City Apps: 5
-- Housing Websites: 4
-- Air Quality: 12
-- City News: 4