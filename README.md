# **Despliegue de la Lambda en AWS**

![Modelo de Arquitectura](https://github.com/user-attachments/assets/43abc5a5-7867-4e45-8c83-a841ae17cc87)

## **📌 Requisitos previos**
- Tener instalado **Node.js** y **npm**.
- Tener configuradas las credenciales de AWS con `aws configure`.
- Asegurarse de que la función Lambda ya existe en AWS.

## **🚀 Pasos para desplegar en AWS Lambda**

### **1️⃣ Compilar el código TypeScript**
```sh
npx tsc
```
Esto generará la carpeta `dist/` con el código transpilado a JavaScript.

### **2️⃣ Copiar `package.json` y `package-lock.json` a `dist/`**
```sh
cp package.json package-lock.json dist/
```
Esto es necesario para instalar las dependencias en el siguiente paso.

### **3️⃣ Moverse al directorio `dist/`**
```sh
cd dist
```

### **4️⃣ Instalar dependencias de producción**
```sh
npm install --omit=dev
```
Esto instala solo las dependencias necesarias para producción, reduciendo el tamaño del paquete.

### **5️⃣ Comprimir el código en un archivo ZIP**
```sh
Compress-Archive -Path * -DestinationPath lambda-function.zip
```
Este comando crea un archivo `lambda-function.zip` con el contenido de `dist/`.

### **6️⃣ Subir el código a AWS Lambda**
```sh
aws lambda update-function-code --function-name NOMBRE_DE_TU_LAMBDA --zip-file fileb://lambda-function.zip
```
Reemplaza **`NOMBRE_DE_TU_LAMBDA`** con el nombre de tu función en AWS Lambda.

---

![Modelo Logico](https://github.com/user-attachments/assets/0b78e3c0-3e5f-4576-bee0-db3b1b2b3d76)

# **💻 Pruebas en local**
Para ejecutar el proyecto en tu máquina local:

### **1️⃣ Instalar dependencias**
```sh
npm install
```

### **2️⃣ Iniciar el servidor**
```sh
npm run start
```
Este comando compila el código y ejecuta el servidor con `ts-node`.

