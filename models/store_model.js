const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const storeSchema = new Schema({

    id_user: String,
    status_pembayaran:Number,
    status_pengiriman: Number,
    status_transaksi: Number,
    total_bayar:Number,
    tgl_store: String,

});

const Store = mongoose.model('stores', storeSchema);

module.exports = Store;