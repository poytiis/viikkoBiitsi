export const updateCountingScores = (count: number) => {
  return 'UPDATE viikko_biitsi_hallinta SET hallinta_arvo=' + count.toString() + " WHERE hallinta_avain='laskettavat_kerrat_pisteisiin';" ;
}