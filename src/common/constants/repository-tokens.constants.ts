/**
 * Repository Tokens
 * @description Constants for repository injection tokens
 */
export const REPOSITORY_TOKENS = {
  PRODUCT_REPOSITORY: 'IProductRepository',
  PRODUCT_WAREHOUSE_REPOSITORY: 'IProductWarehouseRepository',
  USER_REPOSITORY: 'IUserRepository',
  WAREHOUSE_REPOSITORY: 'IWarehouseRepository',
  INVENTORY_COUNT_REPOSITORY: 'IInventoryCountRepository',
  INVENTORY_LINE_REPOSITORY: 'IInventoryLineRepository',
  CITIES_REPOSITORY: 'ICitiesRepository',
  COUNTRIES_REPOSITORY: 'ICountriesRepository',
  DEPARTMENTS_REPOSITORY: 'IDepartmentsRepository',
  LOGIN_AUDIT_REPOSITORY: 'ILoginAuditRepository',
} as const;

