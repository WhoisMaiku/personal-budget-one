const app = require('express')();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
); 

app.get('/', (req, res) => {
    res.status(200).send({
        "message": "Hello World"});
});