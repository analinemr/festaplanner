/**
 * ENVIRONMENT — Configuração de Ambiente de Desenvolvimento
 *
 * Usado automaticamente pelo Angular CLI ao executar:
 *   ng serve
 *
 * Aponta para o backend Spring Boot rodando localmente.
 */
export const environment = {

  production: false,

  /**
   * apiUrl → URL base do backend Spring Boot local.
   * ATENÇÃO: confira sempre no console do Spring Boot qual porta o
   * Tomcat realmente usou ("Tomcat started on port XXXX") antes de
   * testar o frontend — a porta pode ser 8080 ou 8081 dependendo se
   * o XAMPP está ocupando a 8080 nesta máquina.
   */
  apiUrl: 'http://localhost:8080/api'

};