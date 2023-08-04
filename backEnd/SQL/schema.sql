CREATE DATABASE IF NOT EXISTS viikkobiitsi;

USE viikkobiitsi;

CREATE TABLE wpzl_postmeta(
  meta_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id int,
  meta_key varchar(100),
  meta_value varchar(100)
);

CREATE TABLE syotetyt_tulokset_varmuuskopio(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  meta_id int NOT NULL,
  post_id int NOT NULL,
  meta_key varchar(100),
  meta_value varchar(100),
  insert_date date
);

CREATE TABLE viikon_tulokset_muutokset(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  vanha_arvo varchar(500),
  uusi_arvo varchar(500),
  aikaleima date
);

CREATE TABLE viikon_tulokset(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255) NOT NULL,
  sarja varchar(255),
  viikko int,
  lohko int,
  sijoitus int,
  pelatut_pisteet int,
  sarja_pisteet float,
  vuosi int
);

CREATE TABLE viikon_tulokset_varmuuskopio(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255) NOT NULL,
  sarja varchar(255),
  viikko int,
  lohko int,
  sijoitus int,
  pelatut_pisteet int,
  sarja_pisteet float,
  vuosi int
);

CREATE TABLE kokonaistulokset_miehet(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255),
  viikko_1 float,
  viikko_2 float,
  total float
);

CREATE TABLE kokonaistulokset_naiset(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255),
  viikko_1 float,
  viikko_2 float,
  total float
);

CREATE TABLE lokitiedot(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  aikaleima varchar(255),
  merkinta varchar(255)
);

CREATE TABLE kausikortit(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255),
  vuosi int
);

CREATE TABLE viikko_biitsi_hallinta(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hallinta_avain varchar(255),
  hallinta_arvo varchar(255)

);


INSERT INTO viikko_biitsi_hallinta VALUES 
  (DEFAULT, 'laskettavat_kerrat_pisteisiin', '2'),
  (DEFAULT, 'viikkobiitsi', '075A421A01FE4984B4ADE4A89AFEC861F9A435F54B5BCED6D0A0E5A8792E521C');