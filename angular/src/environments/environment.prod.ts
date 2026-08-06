/**
 * ENVIRONMENT PROD — Configuração de Ambiente de Produção
 *
 * Usado automaticamente pelo Angular CLI ao executar:
 *   ng build --configuration production
 *
 * O CLI substitui environment.ts por este arquivo em produção
 * graças ao fileReplacements configurado no angular.json.
 *
 * IMPORTANTE: Atualizar a apiUrl com o endereço real do servidor
 * onde o Spring Boot estará hospedado (ex: VPS, Heroku, Railway, etc.)
 */
export const environment = {

  production: true,

  /**
   * apiUrl → URL base do backend Spring Boot em produção.
   * SUBSTITUA pela URL real antes do deploy!
   */
  apiUrl: 'https://api.festaplanner.com.br/api'

};