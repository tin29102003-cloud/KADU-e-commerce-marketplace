import { OpenAPIV3 } from "openapi-types";
import { Express } from "express"; //import kiểu express cho ap
import path from "path";
import fs from "fs";
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc  from 'swagger-jsdoc';
import { Options } from "swagger-jsdoc";
// type SwaggerSpec = OpenAPIV3.Document; //sử dụng kiểu OpenApi để kiểm tra type tốt hơn
// const setupSwagger = (app: Express): void => {
//   const swaggerFiles = [path.join(process.cwd(), "src/swagger/auth.json")];
//   //khởi tạo đối tuong path rỗng
//   let paths: OpenAPIV3.PathsObject = {};
//   swaggerFiles.forEach((file) => {
//     try {
//       //dọc file và parse JSON
//       const data = JSON.parse(fs.readFileSync(file, "utf-8")) as {
//         paths: OpenAPIV3.PathsObject;
//       };
//       paths = { ...paths, ...data.paths };
//     } catch (error) {
//       // console.error(`Lỗi khi đọc hoặc parse file Swagger: ${file}`, error);
//     }
//   });
//   const swaggerSpec: SwaggerSpec = {
//     openapi: "3.0.0",
//     info: { title: "API project", version: "1.0.0" },
//     servers: [{ url: "http://localhost:5000" }],
//     components: {
//       securitySchemes: {
//         cookieAuth: {
//           type: "apiKey",
//           in: "cookie",
//           name: "token", //ten cua cookie đó
//         } as OpenAPIV3.ApiKeySecurityScheme, //ép kiểu swwaager ui cần các thuộc tính này
//       },
      
//     },
//     // security: [{ cookieAuth: [] }],//bật cái này là bảo vệ hết á nha
//     paths,
//   };
  
//   app.use('/api-docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec,{
//         swaggerOptions: {
//             withCredentials: true///cho phép gửi cookie khi test api doc
//         }
//     })
//   )
// };
//sử dụng kiểu OpenApi để kiểm tra type tốt hơn
// const setupSwagger = (app: Express): void => {
//   const swaggerFiles = path.join(process.cwd(), "src/swagger/swagger-output.json");
//   //khởi tạo đối tuong path rỗng
//   if(!fs.existsSync(swaggerFiles)){
//     console.log("⏳ Đang đợi sinh file Auto Swagger...");
//       return;
//   }
//   //dọc file json dã đc tự dông sinh ra
//   const swaggerSpec = JSON.parse(fs.readFileSync(swaggerFiles, "utf-8"));
  
//   app.use('/api/docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec,{
//         swaggerOptions: {
//             withCredentials: true///cho phép gửi cookie khi test api doc
//         }
//     })
//   )
// };

//làm jsdoc tự ren ra code



const setupSwagger = (app: Express): void => {
  const options: Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API project",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:5000" }],
      components: {
        securitySchemes: {
          cookieACTK: {
            type: "apiKey",
            in: "cookie",
            name: "_atkn", 
          } as OpenAPIV3.ApiKeySecurityScheme,
          cookieRFTK: {
            type: "apiKey",
            in: "cookie",
            name: "__rtkn", 
          } as OpenAPIV3.ApiKeySecurityScheme,
        },
      },
    },
    apis: ["./src/docs/*.yaml"],
  };

  const swaggerSpec = swaggerJsdoc(options) as OpenAPIV3.Document;

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        withCredentials: true,
      },
    })
  );
};

export default setupSwagger;

// export default setupSwagger;
