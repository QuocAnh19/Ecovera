/**
 * DEPRECATED: Tệp này đã được chuyển đổi hoàn toàn sang kiến trúc 3 lớp Clean Architecture:
 * - Route: Server/src/Routes/order.routes.js
 * - Controller: Server/src/controllers/order.controller.js
 * - Service: Server/src/services/order.service.js
 * 
 * Re-export router mới để tương thích ngược 100% nếu có tệp nào import.
 */
export { default } from "../order.routes.js";
