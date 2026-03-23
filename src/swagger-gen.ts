// import { OpenAPIV3 } from 'openapi-types';
// import swaggerAutogen from 'swagger-autogen';
// ///không kế thừa từ swagger type nữa
// // Tạo một type mới: Lấy OpenAPIV3.Document nhưng loại bỏ (Omit) thuộc tính 'paths'
// type SwaggerAutogenDoc = Omit<OpenAPIV3.Document, 'paths'>;
// const doc: SwaggerAutogenDoc = {
//   openapi: "3.0.0",  
//   info: { title: "API project", version: "1.0.0" },
//   servers: [{ url: "http://localhost:5000" }],
//   components: {
//     securitySchemes: {
//       cookieAuth: {
//         type: "apiKey",
//         in: "cookie",
//         name: "token",
//       } as OpenAPIV3.ApiKeySecurityScheme,
//     },
//   },
// };

// const outputFile = './swagger/swagger-output.json'; // Nơi nó sẽ tự đẻ ra file
// const endpointsFiles = ['./index.ts']; // Thay bằng file chứa router chính của bro

// // Chạy tự động sinh file JSON
// swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);