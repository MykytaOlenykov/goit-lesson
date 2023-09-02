const { connect } = require("mongoose");

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

const connectDB = async () => {
  try {
      const db = await connect(process.env.DB_HOST);
      console.log(`db is connected. name: ${db.connection.name}. PORT: ${db.connection.port}. HOST: ${db.connection.host}.`.green.italic.bold);
  } catch (error) {
      console.log(error.message.red.bold)
      process.exit(1)
  }
};

module.exports = connectDB;
