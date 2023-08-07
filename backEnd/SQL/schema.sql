CREATE DATABASE IF NOT EXISTS viikkobiitsi;

USE viikkobiitsi;

CREATE TABLE IF NOT EXISTS wpzl_postmeta(
  meta_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id int,
  meta_key varchar(100),
  meta_value varchar(100)
);

CREATE TABLE IF NOT EXISTS syotetyt_tulokset_varmuuskopio(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  meta_id int NOT NULL,
  post_id int NOT NULL,
  meta_key varchar(100),
  meta_value varchar(100),
  insert_date date
);

CREATE TABLE IF NOT EXISTS viikon_tulokset_muutokset(
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  vanha_arvo varchar(500),
  uusi_arvo varchar(500),
  aikaleima date
);

CREATE TABLE TABLE IF NOT EXISTS viikon_tulokset(
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

CREATE TABLE TABLE IF NOT EXISTS viikon_tulokset_varmuuskopio(
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

CREATE TABLE TABLE IF NOT EXISTS kokonaistulokset_miehet(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255),
  viikko_1 float,
  viikko_2 float,
  total float
);

CREATE TABLE TABLE IF NOT EXISTS kokonaistulokset_naiset(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255),
  viikko_1 float,
  viikko_2 float,
  total float
);

CREATE TABLE TABLE IF NOT EXISTS lokitiedot(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  aikaleima varchar(255),
  merkinta varchar(255)
);

CREATE TABLE TABLE IF NOT EXISTS kausikortit(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nimi varchar(255),
  vuosi int
);

CREATE TABLE TABLE IF NOT EXISTS viikko_biitsi_hallinta(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hallinta_avain varchar(255),
  hallinta_arvo varchar(255)

);
