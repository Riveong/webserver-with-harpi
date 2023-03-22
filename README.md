# 1. npm install @hapi/hapi
2. buat server.js dan routes.js
3. masukan : 

1. const routes = [
2. {
3. method: 'GET', //untuk menandai method get
4. path: '/', //untuk menandai route
5. handler: (request, h) => {
6. return 'Homepage';
7. },
8. },
9. {
10. method: 'GET', //untuk menandai method get
11. path: '/about',
12. handler: (request, h) => {
13. return 'About page';
14. },
15. },
16. ];
17. 
18. module.exports = routes;

ke dalam routes.js

 4. masukan 

1. const Hapi = require('@hapi/hapi');
2. const routes = require('./routes');
3. 
4. const init = async () => {
5. const server = Hapi.server({
6. port: 5000,
7. host: 'localhost',
8. });
9. 
10. server.route(routes); //untuk menyambungkan dengan routes.js
11. 
12. await server.start();
13. console.log(`Server berjalan pada ${server.info.uri}`);
14. };
15. 
16. init();

kedalam server.js

untuk mendapakan semua method juga bisa pakai 

1. const routes = [
2. {
3. method: '*',
4. path: '/',
5. handler: (request, h) => {
6. return 'Halaman tidak dapat diakses dengan method tersebut';
7. },

# path parameter

didalam path bisa diberi parameter :

1. server.route({
2. method: 'GET',
3. path: '/users/{username}',
4. handler: (request, h) => {
5. const { username } = request.params;
6. return `Hello, ${username}!`;
7. },
8. });

dengan mengawali {} didalamya dapat diberi nama parameter

apabila pathnya bersifat opsional maka belakangnya dapat di beri ?

1. server.route({
2. method: 'GET',
3. path: '/users/{username?}',
4. handler: (request, h) => {
5. const { username = 'stranger' } = request.params;
6. return `Hello, ${username}!`;
7. },
8. });

### Query Parameter

Selain path parameter, terdapat cara lain yang sering digunakan dalam mengirimkan data melalui URL, yakni dengan query parameter. Teknik ini umum digunakan pada permintaan yang membutuhkan kueri dari client, contohnya seperti pencarian dan filter data.

Data yang dikirim melalui query memiliki format **key=value**, contohnya:

`1. localhost:5000?name=harry&location=bali`

Contoh di atas memiliki dua query parameter. Yang pertama adalah name=harry dan location=bali. Tanda tanya (**?**) di sana berfungsi sebagai separator (pemisah) antara path dan query parameter.

Di Hapi, Anda bisa mendapatkan nilai dari query parameter melalui request.query.

`1. server.route({
2.     method: 'GET',
3.     path: '/',
4.     handler: (request, h) => {
5.         **const { name, location } = request.query;**
6.         return `Hello, ${name} from ${location}`;
7.     },
8.  });`

hal ini dapat di terapkan untuk language (bahasa)

1. {
2. method: 'GET',
3. path: '/hello/{name?}',
4. handler: (request, h) => {
5. const { name = "stranger" } = request.params;
6. const { lang } = request.query;
7. 
8.  **if(lang === 'id') {**
9. **return `Hai, ${name}!`;**
10. **}**
11. 
12. **return `Hello, ${name}!`;**
13. },
14. },

contoh output

1. curl -X GET http://localhost:5000/hello/dicoding?lang=id
2. // output: Hai, dicoding!
3. curl -X GET http://localhost:5000/hello/dicoding
4. // output: Hello, dicoding!

# body / payload request (readable stream)

Ketika menggunakan Node.js, untuk mendapatkan data pada body request--meskipun datanya hanya sebatas teks--kita harus berurusan dengan Readable Stream, di mana untuk mendapatkan data melalui stream tak semudah seperti kita menginisialisasikan sebuah nilai pada variabel.

*Good News!* Ketika menggunakan Hapi, Anda tidak lagi berurusan dengan stream untuk mendapatkan datanya. Di balik layar, Hapi secara default akan mengubah payload JSON menjadi objek JavaScript. Dengan begitu, Anda tak lagi berurusan dengan JSON.parse()! Keren, kan?

Kapan pun client mengirimkan payload berupa JSON, payload tersebut dapat diakses pada route handler melalui properti request.payload. Contohnya seperti ini:

`1. server.route({
2.     method: 'POST',
3.     path: '/login',
4.     handler: (request, h) => {
5.         const { username, password } = request.payload;
6.         return `Welcome ${username}!`;
7.     },
8. });`

Pada contoh di atas, handler menerima payload melalui request.payload. Dalam kasus tersebut, client mengirimkan data login dengan struktur:

`1. { "username": "harrypotter", "password": "encryptedpassword" }`

## **Response Toolkit**

Fungsi handler pada Hapi memiliki dua parameters, yakni request dan h.

Sebagaimana yang sudah banyak kita bahas sebelumnya, request parameter merupakan objek yang menampung detail dari permintaan client, seperti path dan query parameters, payload, headers, dan sebagainya. Ada baiknya Anda eksplorasi secara lebih dalam apa fungsi dari parameter request pada [referensi API Hapi](https://hapi.dev/api/?v=20.1.0#request-properties).

Parameter yang kedua yaitu h (huruf inisial Hapi). Parameter ini merupakan [response toolkit](https://hapi.dev/api/#response-toolkit) di mana ia adalah objek yang menampung banyak sekali method yang digunakan untuk menanggapi sebuah permintaan client. Objek ini serupa dengan objek response pada request handler ketika kita menggunakan Node.js native.

Seperti yang sudah Anda lihat pada contoh dan latihan sebelumnya, jika hanya ingin mengembalikan nilai pada sebuah permintaan yang datang, di Hapi Anda bisa secara langsung mengembalikan nilai dalam bentuk teks, HTML, JSON, stream, atau bahkan promise.

`1. server.route({
2.     method: 'GET',
3.     path: '/',
4.     handler: (request, h) => {
5.         return `Homepage`;
6.     },
7. });`

Jika kita dapat mengembalikan permintaan secara singkat, lalu apa fungsi dari h? Kapan kita membutuhkannya?

Bila kasusnya sederhana seperti di atas, memang lebih baik Anda langsung kembalikan dengan nilai secara eksplisit. Namun, ketahuilah bahwa dengan cara tersebut status response selalu bernilai **200 OK**. Nah, ketika Anda butuh mengubah nilai status response, di situlah Anda membutuhkan parameter h.

`1. server.route({
2.     method: 'POST',
3.     path: '/user',
4.     handler: (request, h) => {
5.         return h.response('created').code(201);
6.     },
7. });`

Fungsi handler harus selalu mengembalikan sebuah nilai. Bila Anda menggunakan h ketika menangani permintaan, kembalikanlah dengan nilai h.response(). Anda bisa lihat contoh kode di atas.

Parameter h tidak hanya berfungsi untuk menetapkan status kode respons. Melalui h, Anda juga bisa menetapkan header response, content type, content length, dan masih banyak lagi.

`1. // Detailed notation
2. const handler = (request, h) => {
3.     const response = h.response('success');
4.     response.type('text/plain');
5.     response.header('X-Custom', 'some-value');
6.     return response;
7. };
8.  
9. // Chained notation
10. const handler = (request, h) => {
11.     return h.response('success')
12.         .type('text/plain')
13.         .header('X-Custom', 'some-value');
14. };`
