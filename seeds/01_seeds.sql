\copy users FROM 'seeds/users.csv' DELIMITER ',' CSV HEADER 

\copy properties FROM 'seeds/properties.csv' DELIMITER ',' CSV HEADER 

\copy reservations FROM 'seeds/reservations.csv' DELIMITER ',' CSV HEADER 

\copy property_reviews FROM 'seeds/property_reviews.csv' DELIMITER ',' CSV HEADER 