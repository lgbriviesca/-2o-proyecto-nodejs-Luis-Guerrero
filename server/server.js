const { app } = require('./app');
const { initRelations } = require('./models/relations');

const { db } = require('./utils/database');

db.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch(err => console.log(err));

initRelations();

db.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`2o proyecto is running on port: ${PORT}`);
});
