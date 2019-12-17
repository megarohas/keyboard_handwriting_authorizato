const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users_schema = new Schema({
  name: String,
  password_hash: String,
  email: { type: String, unique: true },
  token: { type: String, unique: true },
  id: { required: true, type: String, unique: true }
  // shopify_order_data: { type: Schema.Types.Mixed, required: true },
  // status: { type: Boolean, required: true },
  // status_detail: { type: Schema.Types.Mixed, required: true },
  // order_id: { type: String, required: true, unique: true },
  // fullfilment_status: { type: Boolean },
  // fullfilment_data: { type: Schema.Types.Mixed },
  // printech_account_id: { type: String, required: true },
  // tracking_number: { type: String, required: false }
  // powermerchOrderId: {
  //   type: String,
  //   trim: true,
  //   index: {
  //     unique: true,
  //     partialFilterExpression: { powermerchOrderId: { $type: "string" } }
  //   }
  // } //TODO: переделать логику в orders.js и сделать unique:true
});
// exports.createUsersTable = mongoose.model("users", userSchema);
// exports.users = mongoose.model("users", userSchema);
exports.users_schema = users_schema;

const nets_schema = new Schema({
  phrase: String,
  net: Schema.Types.Mixed,
  id: { required: true, type: String, unique: true }
  // shopify_order_data: { type: Schema.Types.Mixed, required: true },
  // status: { type: Boolean, required: true },
  // status_detail: { type: Schema.Types.Mixed, required: true },
  // order_id: { type: String, required: true, unique: true },
  // fullfilment_status: { type: Boolean },
  // fullfilment_data: { type: Schema.Types.Mixed },
  // printech_account_id: { type: String, required: true },
  // tracking_number: { type: String, required: false }
  // powermerchOrderId: {
  //   type: String,
  //   trim: true,
  //   index: {
  //     unique: true,
  //     partialFilterExpression: { powermerchOrderId: { $type: "string" } }
  //   }
  // } //TODO: переделать логику в orders.js и сделать unique:true
});

// exports.createUsersTable = mongoose.model("users", userSchema);
// exports.users = mongoose.model("users", userSchema);
exports.nets_schema = nets_schema;
