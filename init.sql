CREATE DATABASE IF NOT EXISTS livescore_lemontech;

USE livescore_lemontech;

CREATE TABLE Team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(100),
    name VARCHAR(100),
    location VARCHAR(100)
);

ALTER TABLE Team ADD CONSTRAINT uk_external_id UNIQUE (external_id);

CREATE TABLE League (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(255),
    name VARCHAR(255),
    name_format VARCHAR(255),
    location VARCHAR(255)
);

ALTER TABLE League ADD CONSTRAINT uk_external_id UNIQUE (external_id);

CREATE TABLE NextMatchDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_name VARCHAR(100),
    away_team_name VARCHAR(100),
    date_day VARCHAR(100),
    day_time VARCHAR(100),
    date_time DATETIME,
    url_next_match VARCHAR(255),
    id_team INT,
    notified BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_match_details (home_team_name, away_team_name, url_next_match, id_team),
    FOREIGN KEY (id_team) REFERENCES Team(id)
);

CREATE TABLE Subscription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    usuario_id INT, 
    FOREIGN KEY (team_id) REFERENCES Team(id),
    UNIQUE KEY uk_subscription (team_id, usuario_id)
);