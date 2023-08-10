export const updateCountingScores = (count: number) => {
  return 'UPDATE viikko_biitsi_hallinta SET hallinta_arvo=' + count.toString() + " WHERE hallinta_avain='laskettavat_kerrat_pisteisiin';" ;
}

export const clearUsers = 'DELETE FROM viikko_biitsi_hallinta'
export const initTestUser = `INSERT INTO viikko_biitsi_hallinta VALUES 
  (DEFAULT, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'),
  (DEFAULT, 'laskettavat_kerrat_pisteisiin', '2');`; 