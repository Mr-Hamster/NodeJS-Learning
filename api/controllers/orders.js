const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
	Order.find()
		.select('product quantity _id')
		.populate('product', 'name price')
		.exec()
		.then(data => {
			res.status(200).json({
				count: data.length,
				orders: data
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.orders_create_order = (req, res, next) => {
	Product.findById(req.body.productId)
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: 'Product not found'
				});  
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
				product: req.body.productId
			})
			return order.save()
		})
		.then(result => {
			res.status(201).json({
				message: 'Order was created!',
				order: result
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
};

exports.orders_get_by_id = (req, res, next) => {
	Order.findById(req.params.orderId)
		.populate('product')
		.exec()
		.then(order => {
			res.status(200).json({
				order: order
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.orders_delete_one = (req, res, next) => {
	Order.remove({ _id: req.params.orderId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(404).json({
					message: 'Order not found'
				});
			}
			res.status(200).json({
				message: 'Order deleted',
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};